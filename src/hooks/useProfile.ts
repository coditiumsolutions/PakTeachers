import { useEffect, useState } from 'react'
import { authApi, type UserProfileDTO } from '../lib/api'

interface ProfileState {
  profile: UserProfileDTO | null
  isLoading: boolean
  error: string | null
}

export function useProfile(): ProfileState {
  const [state, setState] = useState<ProfileState>({
    profile: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    authApi.me()
      .then(({ data }) => {
        if (data.success && data.data) {
          setState({ profile: data.data, isLoading: false, error: null })
        } else {
          setState({ profile: null, isLoading: false, error: data.message ?? 'Failed to load profile' })
        }
      })
      .catch(() =>
        setState({ profile: null, isLoading: false, error: 'Network error loading profile' })
      )
  }, [])

  return state
}
