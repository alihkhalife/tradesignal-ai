import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export function AuthCallback() {
  useEffect(() => {
    // Supabase OAuth redirects here with #access_token=... in the hash fragment.
    // The Supabase client (with detectSessionInUrl: true) automatically parses
    // the hash and establishes the session. We listen for that event, then
    // do a full page redirect to /dashboard so the app loads fresh with the session.

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        // Session established — full page redirect (not React Router navigate)
        // so the app reloads clean with the session in localStorage
        subscription.unsubscribe()
        window.location.href = '/dashboard'
      }
    })

    // Also check if session is already available (e.g. hash was already parsed)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        subscription.unsubscribe()
        window.location.href = '/dashboard'
      }
    })

    // Safety timeout — if nothing happens in 8 seconds, go to login
    const timeout = setTimeout(() => {
      subscription.unsubscribe()
      window.location.href = '/login'
    }, 8000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-text-secondary">Signing you in...</p>
      </div>
    </div>
  )
}
