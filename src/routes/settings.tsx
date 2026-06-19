import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { AlertCircle, Mail, Key, Trash2, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { deleteUserAccount } from '@/lib/api/auth.functions'

export const Route = createFileRoute('/settings')({
  head: () => ({
    meta: [
      { title: 'Account Settings | SnapCut' },
      { name: 'description', content: 'Manage your account settings, update email, password, and delete your account.' },
    ],
  }),
  component: SettingsPage,
})

function SettingsPage() {
  const navigate = useNavigate()
  const { user, isLoading, signOut } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!user) return
    setEmail(user.email ?? '')
    setNewEmail(user.email ?? '')
    setDisplayName((user.user_metadata as any)?.full_name ?? '')
  }, [user])

  const resetMessages = () => {
    setStatus(null)
    setError(null)
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    resetMessages()
    setIsSavingProfile(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: displayName || null,
        },
      })
      if (updateError) throw updateError
      setStatus('Profile updated successfully.')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update profile.')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    resetMessages()
    setIsUpdatingEmail(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({ email: newEmail })
      if (updateError) throw updateError
      setStatus('Email update requested. You may need to confirm the new email address.')
      setEmail(newEmail)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update email.')
    } finally {
      setIsUpdatingEmail(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    resetMessages()
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsUpdatingPassword(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError
      setStatus('Password updated successfully.')
      setPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update password.')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return

    resetMessages()
    setIsDeleting(true)

    try {
      await deleteUserAccount({ userId: user.id })
      await signOut()
      navigate({ to: '/' })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete account.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400 mx-auto" />
          <p className="mt-4 text-gray-400">Loading account settings...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="max-w-md text-center p-6 bg-gray-900 rounded-3xl border border-gray-800">
          <h1 className="text-2xl font-semibold mb-3">Not signed in</h1>
          <p className="text-gray-400 mb-6">Please sign in to manage your account settings.</p>
          <Button onClick={() => navigate({ to: '/login' })}>Go to sign in</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <p className="text-gray-400 mt-2">Update your profile, change your login email or password, or delete your account.</p>
          </div>
          <Button variant="outline" onClick={() => navigate({ to: '/dashboard' })}>
            Back to dashboard
          </Button>
        </div>

        {status && (
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-200">
            {status}
          </div>
        )}

        {error && (
          <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-8">
            <Card className="bg-gray-900 border border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserIcon className="w-5 h-5" /> Profile</CardTitle>
                <CardDescription>Update your display name and contact email.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display name</Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(event) => setDisplayName(event.target.value)}
                      placeholder="Your name"
                      autoComplete="name"
                    />
                  </div>
                  <Button type="submit" disabled={isSavingProfile}>
                    {isSavingProfile ? 'Saving...' : 'Save profile'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Mail className="w-5 h-5" /> Email</CardTitle>
                <CardDescription>Change the email address used to sign in.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateEmail} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentEmail">Current email</Label>
                    <Input id="currentEmail" value={email} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newEmail">New email</Label>
                    <Input
                      id="newEmail"
                      type="email"
                      value={newEmail}
                      onChange={(event) => setNewEmail(event.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isUpdatingEmail || newEmail === email}>
                    {isUpdatingEmail ? 'Updating email...' : 'Update email'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Key className="w-5 h-5" /> Password</CardTitle>
                <CardDescription>Set a new password for your account.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePassword} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm new password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isUpdatingPassword}>
                    {isUpdatingPassword ? 'Updating password...' : 'Update password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gray-900 border border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><AlertCircle className="w-5 h-5 text-amber-400" /> Danger Zone</CardTitle>
                <CardDescription>Delete your account and remove all associated data.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200">
                  Deleting your account is permanent. Your images, credits, and profile data will be removed.
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full" disabled={isDeleting}>
                      {isDeleting ? 'Deleting account...' : 'Delete account'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete account?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. If you delete your account, all user data will be removed and you will be signed out.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteAccount}>
                        Delete account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
