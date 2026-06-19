import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/Logo'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallbackPage,
})

type Status = 'loading' | 'success' | 'error'

function AuthCallbackPage() {
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // When Supabase auth is initialized with detectSessionInUrl, the client
        // will look for auth tokens in the callback URL and populate session data.
        const { data: { session }, error } = await supabase.auth.getSession()
        console.log('[AuthCallback] getSession', { session, error })

        if (error) {
          console.error('Auth callback error:', error)
          setStatus('error')
          setMessage(error.message || 'Failed to verify email')
          return
        }

        if (session) {
          setStatus('success')
          setMessage('Email confirmed successfully!')
          window.location.replace('/')
        } else {
          setStatus('error')
          setMessage('No valid session found')
        }
      } catch (err) {
        console.error('Callback error:', err)
        setStatus('error')
        setMessage('Something went wrong')
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Logo className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {status === 'loading' ? 'Verifying Email...' : 
             status === 'success' ? 'Email Confirmed!' : 'Verification Failed'}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          {status === 'loading' && (
            <Loader2 className="h-16 w-16 text-cyan-400 animate-spin" />
          )}
          {status === 'success' && (
            <div className="flex flex-col items-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <p className="text-sm text-slate-300 text-center">
                Redirecting you to the home page in a moment...
              </p>
            </div>
          )}
          {status === 'error' && (
            <div className="flex flex-col items-center">
              <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
              <div className="flex flex-col items-center gap-4 mt-2">
                <p className="text-sm text-slate-300 text-center mb-2">
                  Please try again or return to the login page
                </p>
                <button 
                  onClick={() => navigate({ to: '/login' })} 
                  className="text-cyan-400 hover:underline font-medium"
                >
                  Go to Login
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
