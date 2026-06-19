import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth'
import { Logo } from '@/components/Logo'
import { AlertCircle, Mail, CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function getSimpleErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'message' in err && typeof (err as { message: string }).message === 'string') {
    return (err as { message: string }).message;
  }
  return fallback;
}

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isEmailNotConfirmed, setIsEmailNotConfirmed] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [showResentSuccess, setShowResentSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { signIn, resendConfirmation } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsEmailNotConfirmed(false)
    setIsLoading(true)

    try {
      await signIn(email, password)
      navigate({ to: '/' })
    } catch (err: unknown) {
      const errorMsg = getSimpleErrorMessage(err, 'Failed to sign in')
      if (errorMsg.toLowerCase().includes('email not confirmed') || errorMsg.toLowerCase().includes('email not verified')) {
        setIsEmailNotConfirmed(true)
      } else {
        setError(errorMsg)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    if (!email) {
      setError('Please enter your email first')
      return
    }
    setIsResending(true)
    setError(null)
    try {
      await resendConfirmation(email)
      setShowResentSuccess(true)
      setTimeout(() => setShowResentSuccess(false), 5000)
    } catch (err: unknown) {
      setError(getSimpleErrorMessage(err, 'Failed to resend email'))
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Logo className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your SnapCut account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {showResentSuccess ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-400 mb-1">Email sent!</h3>
                    <p className="text-sm text-slate-300">
                      A new confirmation email has been sent to <span className="font-semibold">{email}</span>
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
            {isEmailNotConfirmed ? (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-amber-400 mb-1">Email not confirmed</h3>
                    <p className="text-sm text-slate-300 mb-3">
                      Please check your email and click the confirmation link.
                    </p>
                    <button
                      type="button"
                      onClick={handleResendEmail}
                      disabled={isResending}
                      className="text-sm text-cyan-400 hover:underline font-medium flex items-center gap-1"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      {isResending ? 'Sending...' : 'Resend confirmation email'}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-cyan-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            {error && !isEmailNotConfirmed && !showResentSuccess && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-purple-500" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-cyan-400 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
