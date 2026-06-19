import { supabase } from './supabase'

// Types
export interface UserProfile {
  id: string
  email: string
  credits: number
  plan: 'free' | 'pro'
  pro_expires_at?: string
  created_at: string
  updated_at: string
}

export interface HistoryItem {
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

// User Profile Functions
export async function getOrCreateUserProfile(userId: string, email: string): Promise<UserProfile> {
  // First, try to get existing profile
  const { data: existingProfile, error: fetchError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  console.log('[supabase-utils] getOrCreateUserProfile - fetch result', { existingProfile, fetchError })

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('[supabase-utils] getOrCreateUserProfile fetchError', fetchError)
    throw fetchError
  }

  if (existingProfile) {
    const profile = existingProfile as UserProfile

    console.log('[supabase-utils] existing profile found', profile)
    return profile
  }

  // Create new profile with 2 free credits
  const { data: newProfile, error: createError } = await supabase
    .from('user_profiles')
    .insert({
      id: userId,
      email,
      credits: 2,
      plan: 'free'
    })
    .select('*')
    .single()

  if (createError) {
    throw createError
  }

  console.log('[supabase-utils] created new profile', newProfile)

  return newProfile as UserProfile
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw error
  }

  console.log('[supabase-utils] getUserProfile', { userId, data, error })

  return data as UserProfile | null
}

export async function useCredit(userId: string): Promise<{ success: boolean; newCredits: number }> {
  const { data: profile, error: fetchError } = await supabase
    .from('user_profiles')
    .select('credits, plan, pro_expires_at')
    .eq('id', userId)
    .single()

  if (fetchError) {
    throw fetchError
  }

  console.log('[supabase-utils] useCredit - current profile', profile)

  // Check if pro and still valid
  if (profile.plan === 'pro') {
    if (profile.pro_expires_at) {
      const expiryDate = new Date(profile.pro_expires_at)
      if (expiryDate > new Date()) {
        // Pro is active, don't use credits
        return { success: true, newCredits: profile.credits }
      } else {
        // Pro expired, downgrade to free
        await supabase
          .from('user_profiles')
          .update({ plan: 'free', pro_expires_at: null })
          .eq('id', userId)
      }
    }
  }

  // Free plan, check credits
  if (profile.credits <= 0) {
    return { success: false, newCredits: 0 }
  }

  // Use one credit
  const { data: updatedProfile, error: updateError } = await supabase
    .from('user_profiles')
    .update({ credits: profile.credits - 1 })
    .eq('id', userId)
    .select('credits')
    .single()

  if (updateError) {
    throw updateError
  }

  console.log('[supabase-utils] useCredit - updatedProfile', updatedProfile)

  return { success: true, newCredits: updatedProfile.credits }
}

export async function upgradeToPro(userId: string): Promise<UserProfile> {
  const oneMonthFromNow = new Date()
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1)

  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      plan: 'pro',
      credits: 10,
      pro_expires_at: oneMonthFromNow.toISOString()
    })
    .eq('id', userId)
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data as UserProfile
}

// History Functions
export async function getUserHistory(userId: string): Promise<HistoryItem[]> {
  const { data, error } = await supabase
    .from('image_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data as HistoryItem[]
}

export async function addHistoryItem(
  userId: string,
  originalUrl: string,
  processedUrl: string,
  fileName: string,
  generationTimeMs: number
): Promise<HistoryItem> {
  const { data, error } = await supabase
    .from('image_history')
    .insert({
      user_id: userId,
      original_url: originalUrl,
      processed_url: processedUrl,
      file_name: fileName,
      generation_time_ms: generationTimeMs,
      download_count: 0
    })
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data as HistoryItem
}

export async function renameHistoryItem(itemId: string, newFileName: string): Promise<HistoryItem> {
  const { data, error } = await supabase
    .from('image_history')
    .update({ file_name: newFileName })
    .eq('id', itemId)
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data as HistoryItem
}

export async function incrementDownloadCount(itemId: string): Promise<HistoryItem> {
  const { data, error } = await supabase
    .from('image_history')
    .select('download_count')
    .eq('id', itemId)
    .single()

  if (error) {
    throw error
  }

  const { data: updatedData, error: updateError } = await supabase
    .from('image_history')
    .update({ download_count: (data.download_count || 0) + 1 })
    .eq('id', itemId)
    .select('*')
    .single()

  if (updateError) {
    throw updateError
  }

  return updatedData as HistoryItem
}

export async function deleteHistoryItem(itemId: string): Promise<void> {
  const { error } = await supabase
    .from('image_history')
    .delete()
    .eq('id', itemId)

  if (error) {
    throw error
  }
}

// Calculate average generation time
export function calculateAverageGenerationTime(history: HistoryItem[]): number {
  if (history.length === 0) return 0
  
  const total = history.reduce((sum, item) => sum + (item.generation_time_ms || 0), 0)
  return Math.round(total / history.length)
}
