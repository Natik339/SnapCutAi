export const HISTORY_KEY = 'bg-remover-history'

export function toSecureUrl(url: string): string {
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://')
  }
  return url
}

export function formatHistoryDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeDate(timestamp: number): string {
  const diffMs = Date.now() - timestamp
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
  return formatHistoryDate(timestamp)
}

export function getHistoryItemName(item: { processedUrl: string; timestamp: number }): string {
  try {
    const url = new URL(item.processedUrl)
    const filename = url.pathname.split('/').pop()
    if (filename) return filename
  } catch {
    // fall through to generated name
  }

  return `bg-removed-${item.timestamp}.png`
}

export async function downloadImage(url: string, filename = 'removed-bg.png'): Promise<void> {
  try {
    const secureUrl = toSecureUrl(url)
    const response = await fetch(secureUrl)
    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = downloadUrl
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('Download failed:', error)
    window.open(toSecureUrl(url), '_blank')
  }
}
