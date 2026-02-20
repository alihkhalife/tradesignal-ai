import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { UserProfile } from '@/types/trading'

export function useAuth() {
  const { user, session, profile, loading, setUser, setSession, setProfile, setLoading, reset } =
    useAuthStore()

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    // Get current session (also triggers hash fragment processing for OAuth)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error && error.code === 'PGRST116') {
      // Profile doesn't exist yet, create it
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert({ id: userId } as never)
        .select()
        .single()

      setProfile(newProfile as unknown as UserProfile)
    } else if (data) {
      setProfile(data as unknown as UserProfile)
    }
    setLoading(false)
  }

  async function signInWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  async function signUpWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password })
    return { error }
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { error }
  }

  async function signOut() {
    await supabase.auth.signOut()
    reset()
  }

  async function updateProfile(updates: Partial<UserProfile>) {
    if (!user) return { error: new Error('Not authenticated') }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates as never)
      .eq('id', user.id)
      .select()
      .single()

    if (data) setProfile(data as unknown as UserProfile)
    return { error }
  }

  return {
    user,
    session,
    profile,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    updateProfile,
  }
}
