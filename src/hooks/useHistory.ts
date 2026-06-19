import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '@/lib/auth'
import {
  deleteUserHistory,
  fetchUserHistory,
  insertUserHistory,
  loadLocalHistory,
  saveLocalHistory,
  syncLocalHistoryToSupabase,
  renameHistoryItem as renameHistoryItemInDb,
  incrementDownloadCount as incrementDownloadCountInDb,
} from '@/lib/history'
import type { HistoryInsert, HistoryItem } from '@/types/history'

export function useHistory() {
  const { user, isLoading: authLoading } = useAuth()
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasSyncedRef = useRef(false)

  const loadHistory = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (user) {
        const localHistory = hasSyncedRef.current ? [] : loadLocalHistory()
        const remoteHistory =
          localHistory.length > 0
            ? await syncLocalHistoryToSupabase(user.id, localHistory)
            : await fetchUserHistory(user.id)

        hasSyncedRef.current = true
        setHistory(remoteHistory)
      } else {
        hasSyncedRef.current = false
        setHistory(loadLocalHistory())
      }
    } catch (err) {
      console.error('Failed to load history:', err)
      setError('Failed to load your history. Please refresh and try again.')
      setHistory(user ? [] : loadLocalHistory())
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (authLoading) return
    void loadHistory()
  }, [authLoading, loadHistory])

  const addToHistory = useCallback(
    async (item: HistoryInsert) => {
      if (user) {
        try {
          const savedItem = await insertUserHistory(user.id, item)
          setHistory((prev) => [savedItem, ...prev])
          return savedItem
        } catch (err) {
          console.error('Failed to save history for user:', err)
          setError('Processed image saved locally, but cloud history sync failed.')
        }
      }

      const localItem: HistoryItem = {
        ...item,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        downloadCount: 0,
      }

      setHistory((prev) => {
        const nextHistory = [localItem, ...prev]
        saveLocalHistory(nextHistory)
        return nextHistory
      })

      return localItem
    },
    [user],
  )

  const deleteFromHistory = useCallback(
    async (id: string) => {
      if (user) {
        try {
          await deleteUserHistory(user.id, id)
        } catch (err) {
          console.error('Failed to delete history item:', err)
          setError('Failed to delete this item. Please try again.')
          return
        }
      }

      setHistory((prev) => {
        const nextHistory = prev.filter((item) => item.id !== id)
        if (!user) {
          saveLocalHistory(nextHistory)
        }
        return nextHistory
      })
    },
    [user],
  )

  const renameHistoryItem = useCallback(
    async (id: string, newFileName: string) => {
      if (user) {
        try {
          const updatedItem = await renameHistoryItemInDb(id, newFileName)
          setHistory((prev) =>
            prev.map((item) => (item.id === id ? updatedItem : item))
          )
          return updatedItem
        } catch (err) {
          console.error('Failed to rename history item:', err)
          setError('Failed to rename this item. Please try again.')
        }
      }

      setHistory((prev) => {
        const nextHistory = prev.map((item) =>
          item.id === id ? { ...item, fileName: newFileName } : item
        )
        saveLocalHistory(nextHistory)
        return nextHistory
      })

      return history.find((item) => item.id === id)
    },
    [user, history],
  )

  const incrementDownloadCount = useCallback(
    async (id: string) => {
      if (user) {
        try {
          const updatedItem = await incrementDownloadCountInDb(id)
          setHistory((prev) =>
            prev.map((item) => (item.id === id ? updatedItem : item))
          )
          return updatedItem
        } catch (err) {
          console.error('Failed to increment download count:', err)
        }
      }

      setHistory((prev) => {
        const nextHistory = prev.map((item) =>
          item.id === id ? { ...item, downloadCount: (item.downloadCount || 0) + 1 } : item
        )
        saveLocalHistory(nextHistory)
        return nextHistory
      })

      return history.find((item) => item.id === id)
    },
    [user, history],
  )

  return {
    history,
    isLoading: authLoading || isLoading,
    error,
    isAuthenticated: !!user,
    addToHistory,
    deleteFromHistory,
    renameHistoryItem,
    incrementDownloadCount,
    refreshHistory: loadHistory,
  }
}
