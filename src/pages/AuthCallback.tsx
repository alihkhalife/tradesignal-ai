import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export function AuthCallback() {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)
  const setSession = useAuthStore((s) => s.setSession)

  useEffect(() => {
    // This page handles the OAuth redirect
    // The hash fragment (#access_token=...) is processed by Supabase automatically
    // We just need to wait for the session to be available and then redirect

    async function handleCallback() {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        setSession(session)
        setUser(session.user)
        navigate('/dashboard', { replace: true })
        return
      }

      // If no session yet, the hash might still be processing
      // Listen for the auth state change
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setSession(session)
          setUser(session.user)
          subscription.unsubscribe()
          navigate('/dashboard', { replace: true })
        }
      })

      // Safety timeout
      setTimeout(() => {
        subscription.unsubscribe()
        navigate('/login', { replace: true })
      }, 10000)
    }

    handleCallback()
  }, [navigate, setUser, setSession])

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-text-secondary">Signing you in...</p>
      </div>
    </div>
  )
}
