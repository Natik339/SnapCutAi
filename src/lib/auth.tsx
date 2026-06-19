import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { getOrCreateUserProfile, getUserProfile, type UserProfile } from './supabase-utils'

type AuthContextType = {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  isLoading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resendConfirmation: (email: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // #region debug-point A:auth-report
  const reportDebug = (hypothesisId: string, msg: string, data: Record<string, unknown> = {}) => {
    void fetch('http://127.0.0.1:7777/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'dashboard-stuck-routes',
        runId: 'pre-fix',
        hypothesisId,
        location: 'src/lib/auth.tsx',
        msg: `[DEBUG] ${msg}`,
        data,
        ts: Date.now(),
      }),
    }).catch(() => {})
  }
  // #endregion

  // Load user profile
  const loadProfile = async (userId: string, email: string) => {
    try {
      // #region debug-point A:load-profile-start
      reportDebug('A', 'loadProfile start', { userId, hasEmail: Boolean(email) })
      // #endregion
      const userProfile = await getOrCreateUserProfile(userId, email)
      // #region debug-point A:load-profile-success
      reportDebug('A', 'loadProfile success', {
        userId,
        hasProfile: Boolean(userProfile),
        credits: userProfile?.credits ?? null,
        plan: userProfile?.plan ?? null,
      })
      // #endregion
      setProfile(userProfile)
    } catch (err) {
      // #region debug-point A:load-profile-error
      reportDebug('A', 'loadProfile error', {
        userId,
        error: err instanceof Error ? err.message : String(err),
      })
      // #endregion
    }
  }

  const refreshProfile = async () => {
    if (user) {
      const userProfile = await getUserProfile(user.id)
      setProfile(userProfile)
    }
  }

  // Check for existing session on mount
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        // #region debug-point B:get-session-success
        reportDebug('B', 'getSession result', {
          hasSession: Boolean(data.session),
          userId: data.session?.user?.id ?? null,
        })
        // #endregion
        setSession(data.session)
        setUser(data.session?.user ?? null)

        if (data.session?.user) {
          void loadProfile(data.session.user.id, data.session.user.email || '')
        }
      } catch (err) {
        // #region debug-point B:get-session-error
        reportDebug('B', 'getSession error', {
          error: err instanceof Error ? err.message : String(err),
        })
        // #endregion
      } finally {
        // #region debug-point B:get-session-finally
        reportDebug('B', 'getSession finally setIsLoading false', {})
        // #endregion
        setIsLoading(false)
      }
    }
    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      // #region debug-point B:auth-state-change
      reportDebug('B', 'onAuthStateChange', {
        event: _event,
        userId: newSession?.user?.id ?? null,
        hasSession: Boolean(newSession),
      })
      // #endregion
      setSession(newSession)
      setUser(newSession?.user ?? null)
      setIsLoading(false)

      if (newSession?.user) {
        void loadProfile(newSession.user.id, newSession.user.email || '')
      } else {
        setProfile(null)
      }

      // #region debug-point B:auth-state-finish
      reportDebug('B', 'onAuthStateChange setIsLoading false', {
        event: _event,
        hasUser: Boolean(newSession?.user),
      })
      // #endregion
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Sign up
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + '/auth/callback',
      }
    })
    if (error) throw error

    // Only set auth state when Supabase returns an active session.
    // Signup flows that require email confirmation can return a user object
    // without an active session, so we should not treat that as a signed-in state.
    if (data?.session?.user) {
      setSession(data.session)
      setUser(data.session.user)
      await loadProfile(data.session.user.id, data.session.user.email || '')
    }
  }

  // Sign in
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error

    // Immediately update session/user and fetch profile to avoid stale UI state
    if (data?.session?.user) {
      setSession(data.session)
      setUser(data.session.user)
      await loadProfile(data.session.user.id, data.session.user.email || '')
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      // Clear local state regardless
      setUser(null);
      setSession(null);
      setProfile(null);
    }
  };

  // Resend confirmation email
  const resendConfirmation = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: window.location.origin + '/auth/callback',
      },
    })
    if (error) throw error
  }

  // Reset password
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    })
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      profile, 
      isLoading, 
      signUp, 
      signIn, 
      signOut, 
      resendConfirmation,
      resetPassword,
      refreshProfile 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
