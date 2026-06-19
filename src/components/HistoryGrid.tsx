import { Clock, Download, Trash2, Edit2, Check, X, Eye } from 'lucide-react'
import { downloadImage, formatHistoryDate } from '@/lib/history-utils'
import type { HistoryItem } from '@/types/history'
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface HistoryGridProps {
  history: HistoryItem[]
  onDelete: (id: string) => void | Promise<unknown>
  onRename?: (id: string, newName: string) => Promise<unknown>
  onDownload?: (id: string) => Promise<unknown>
  isLoading?: boolean
}

export function HistoryGrid({ history, onDelete, onRename, onDownload, isLoading = false }: HistoryGridProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [isRenaming, setIsRenaming] = useState(false)
  const [previewItem, setPreviewItem] = useState<HistoryItem | null>(null)

  const startRename = (item: HistoryItem) => {
    setEditingId(item.id)
    setEditName(item.fileName || 'removed-bg.png')
  }

  const saveRename = async (item: HistoryItem) => {
    if (!onRename || !editName.trim()) return
    setIsRenaming(true)
    try {
      await onRename(item.id, editName.trim())
      setEditingId(null)
    } catch (err) {
      console.error('Failed to rename:', err)
    } finally {
      setIsRenaming(false)
    }
  }

  const handleDownload = async (item: HistoryItem) => {
    await downloadImage(item.processedUrl, item.fileName || `bg-removed-${item.id}.png`)
    if (onDownload) {
      await onDownload(item.id)
    }
  }

  if (isLoading) {
    return (
      <section className="py-20 px-6 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
        <p className="mt-4 text-muted-foreground">Loading your history...</p>
      </section>
    )
  }

  if (history.length === 0) {
    return (
      <section className="py-20 px-6 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No History Yet</h2>
          <p className="text-muted-foreground mb-6">
            Start removing backgrounds and your processed results will appear here.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Your Background Removals</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <div
              key={item.id}
              className="glass rounded-2xl overflow-hidden shadow-card hover:shadow-glow transition-all"
            >
              <div className="grid grid-cols-2">
                <div className="relative aspect-square bg-gradient-to-br from-slate-700 to-slate-900">
                  <div className="absolute top-2 left-2 text-[10px] uppercase tracking-widest text-white/70 bg-black/50 px-2 py-1 rounded-full">
                    Before
                  </div>
                  {item.originalUrl ? (
                    <img src={item.originalUrl} alt="Before" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-white/50 px-2 text-center">
                      Original not stored
                    </div>
                  )}
                </div>
                <div
                  className="group relative aspect-square"
                  style={{
                    backgroundImage:
                      'repeating-conic-gradient(oklch(0.25 0.04 265) 0% 25%, oklch(0.20 0.04 265) 0% 50%)',
                    backgroundSize: '20px 20px',
                  }}
                >
                  <div className="absolute top-2 left-2 text-[10px] uppercase tracking-widest text-white/70 bg-black/50 px-2 py-1 rounded-full">
                    After
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewItem(item)}
                    className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label={`Preview ${item.fileName || `bg-removed-${item.id}.png`}`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <img src={item.processedUrl} alt="After" className="h-full w-full object-cover" />
                  {item.generationTimeMs > 0 && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/50 text-white text-xs rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {(item.generationTimeMs / 1000).toFixed(1)}s
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground">
                    {formatHistoryDate(item.timestamp)}
                  </span>
                  <div className="flex items-center gap-2">
                    {item.downloadCount > 0 && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {item.downloadCount}
                      </span>
                    )}
                    {onRename && (
                      <button
                        type="button"
                        onClick={() => startRename(item)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        title="Rename"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete from history"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {editingId === item.id ? (
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-3 py-1 text-sm bg-background border border-border rounded-lg"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveRename(item)
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => saveRename(item)}
                      disabled={isRenaming}
                      className="p-1 text-green-400 hover:text-green-300"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="p-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-foreground mb-3 truncate">
                    {item.fileName || `bg-removed-${item.id}.png`}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => handleDownload(item)}
                  className="w-full rounded-xl border border-amber-300/30 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400 px-4 py-2.5 text-white flex items-center justify-center gap-2 font-semibold shadow-lg shadow-fuchsia-950/30 transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-fuchsia-950/40"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Dialog open={Boolean(previewItem)} onOpenChange={(open) => !open && setPreviewItem(null)}>
        <DialogContent className="max-w-3xl border-border bg-background">
          <DialogHeader>
            <DialogTitle>Image preview</DialogTitle>
            <DialogDescription>{previewItem?.fileName || 'Processed image'}</DialogDescription>
          </DialogHeader>
          {previewItem && (
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-black/20">
              <img
                src={previewItem.processedUrl}
                alt={previewItem.fileName || 'Processed image'}
                className="max-h-[70vh] w-full object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
