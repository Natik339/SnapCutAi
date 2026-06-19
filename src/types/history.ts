export interface HistoryItem {
  id: string
  user_id?: string
  originalUrl: string
  processedUrl: string
  fileName: string
  downloadCount: number
  generationTimeMs: number
  timestamp: number
  created_at?: string
  updated_at?: string
}

export type HistoryInsert = Omit<HistoryItem, 'id' | 'timestamp' | 'downloadCount' | 'generationTimeMs'> & {
  generationTimeMs: number
}

export interface ProcessingHistoryRow {
  id: string
  user_id: string
  original_url: string
  processed_url: string
  file_name: string
  download_count: number
  generation_time_ms: number
  created_at: string
  updated_at: string
}
