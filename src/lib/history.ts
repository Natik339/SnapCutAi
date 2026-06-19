import { supabase } from './supabase'
import type { HistoryItem, HistoryInsert, ProcessingHistoryRow } from '../types/history'

const LOCAL_HISTORY_KEY = 'bg-remover-history'

// Convert DB row to app model
function rowToHistoryItem(row: ProcessingHistoryRow): HistoryItem {
  return {
    id: row.id,
    user_id: row.user_id,
    originalUrl: row.original_url,
    processedUrl: row.processed_url,
    fileName: row.file_name,
    downloadCount: row.download_count,
    generationTimeMs: row.generation_time_ms,
    timestamp: new Date(row.created_at).getTime(),
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

// Convert app model to DB insert
function historyItemToRow(item: HistoryInsert, userId: string): Omit<ProcessingHistoryRow, 'id' | 'created_at' | 'updated_at'> {
  return {
    user_id: userId,
    original_url: item.originalUrl,
    processed_url: item.processedUrl,
    file_name: item.fileName,
    download_count: 0,
    generation_time_ms: item.generationTimeMs,
  }
}

// Local Storage helpers
export function loadLocalHistory(): HistoryItem[] {
  try {
    const data = localStorage.getItem(LOCAL_HISTORY_KEY)
    if (!data) return []
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveLocalHistory(history: HistoryItem[]): void {
  localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(history))
}

// Supabase functions
export async function fetchUserHistory(userId: string): Promise<HistoryItem[]> {
  const { data, error } = await supabase
    .from('image_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as ProcessingHistoryRow[]).map(rowToHistoryItem)
}

export async function insertUserHistory(userId: string, item: HistoryInsert): Promise<HistoryItem> {
  const { data, error } = await supabase
    .from('image_history')
    .insert(historyItemToRow(item, userId))
    .select('*')
    .single()

  if (error) throw error
  return rowToHistoryItem(data as ProcessingHistoryRow)
}

export async function deleteUserHistory(userId: string, id: string): Promise<void> {
  const { error } = await supabase
    .from('image_history')
    .delete()
    .eq('user_id', userId)
    .eq('id', id)

  if (error) throw error
}

export async function renameHistoryItem(id: string, newFileName: string): Promise<HistoryItem> {
  const { data, error } = await supabase
    .from('image_history')
    .update({ file_name: newFileName })
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return rowToHistoryItem(data as ProcessingHistoryRow)
}

export async function incrementDownloadCount(id: string): Promise<HistoryItem> {
  // First get current count
  const { data: current, error: fetchError } = await supabase
    .from('image_history')
    .select('download_count')
    .eq('id', id)
    .single()

  if (fetchError) throw fetchError

  // Then increment
  const { data, error } = await supabase
    .from('image_history')
    .update({ download_count: (current.download_count || 0) + 1 })
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return rowToHistoryItem(data as ProcessingHistoryRow)
}

export async function syncLocalHistoryToSupabase(
  userId: string,
  localHistory: HistoryItem[]
): Promise<HistoryItem[]> {
  const remoteHistory = await fetchUserHistory(userId)
  const remoteIds = new Set(remoteHistory.map((item) => item.id))

  for (const item of localHistory) {
    if (!remoteIds.has(item.id)) {
      try {
        await insertUserHistory(userId, {
          originalUrl: item.originalUrl,
          processedUrl: item.processedUrl,
          fileName: item.fileName || 'processed-image.png',
          generationTimeMs: item.generationTimeMs || 3000,
        })
      } catch {
        // Ignore errors for individual items
      }
    }
  }

  const freshRemoteHistory = await fetchUserHistory(userId)

  // Clear guest-only cache after syncing so deleted items do not come back later.
  saveLocalHistory([])

  return freshRemoteHistory
}
