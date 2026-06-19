import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth'
import { Logo } from '@/components/Logo'
import { Mail, CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/signup')({
  component: SignUpPage,
})

function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      await signUp(email, password)
      setShowConfirmation(true)
    } catch (err: any) {
      console.error('Signup error:', err)
      if (err.message?.toLowerCase().includes('user already registered')) {
        setError('An account with this email already exists. Please sign in instead.')
      } else if (err.message?.toLowerCase().includes('rate limit')) {
        setError('Too many sign up attempts! Try signing in or continue without signing up.')
      } else {
        setError(err.message || 'Failed to sign up')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (showConfirmation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">Check your email</CardTitle>
            <CardDescription className="text-slate-300">
              We sent a confirmation email to <span className="font-semibold">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-slate-300">
              <Mail className="h-5 w-5 text-cyan-400" />
              <span>Click the link in the email to confirm your account</span>
            </div>
            <p className="text-sm text-slate-400">
              Didn&apos;t get the email? Check your spam folder or{' '}
              <button 
                onClick={() => setShowConfirmation(false)} 
                className="text-cyan-400 hover:underline"
              >
                try again
              </button>
            </p>
            <div className="mt-6">
              <Link to="/login" className="text-cyan-400 hover:underline text-sm font-medium">
                Already confirmed? Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Logo className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Sign up for a SnapCut account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400 font-medium mb-1">
                  {error.toLowerCase().includes('rate limit') || error.toLowerCase().includes('too many') 
                    ? 'Too many attempts!' 
                    : error.toLowerCase().includes('already exists') 
                      ? 'Account already exists!' 
                      : 'Error signing up'}
                </p>
                <p className="text-xs text-red-300/80">{error}</p>
                {(error.toLowerCase().includes('rate limit') || error.toLowerCase().includes('too many') || error.toLowerCase().includes('already exists')) && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Link to="/login" className="text-xs text-cyan-400 hover:underline font-medium">
                      Try signing in
                    </Link>
                    <Link to="/" className="text-xs text-cyan-400 hover:underline font-medium">
                      Continue without signing up
                    </Link>
                  </div>
                )}
              </div>
            )}
            <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-purple-500" disabled={isLoading}>
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-400 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
