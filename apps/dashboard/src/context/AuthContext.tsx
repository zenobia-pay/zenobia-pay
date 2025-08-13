import {
  createContext,
  useContext,
  createSignal,
  onMount,
  ParentComponent,
  createEffect,
  onCleanup,
} from "solid-js"
import { authService, UserData } from "../services/auth"
import { api } from "../services/api"
import { GetUserProfileResponse } from "../types/api"

interface AuthContextType {
  user: () => UserData | null
  isLoading: () => boolean
  isLoadingUserProfile: () => boolean
  signOut: () => Promise<void>
  signIn: () => Promise<void>
  setUser: (user: UserData | null) => void
  checkAuthStatus: () => Promise<boolean>
  userProfile: () => GetUserProfileResponse | null
  fetchUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>()

export const AuthProvider: ParentComponent = (props) => {
  const [user, setUser] = createSignal<UserData | null>(null)
  const [userProfile, setUserProfile] =
    createSignal<GetUserProfileResponse | null>(null)
  const [isLoading, setIsLoading] = createSignal(true)

  // Separate this from isLoading because we want to show the dashboard ASAP, and don't want
  // to show the loading spinner waiting for another API call (non blocking)
  const [isLoadingUserProfile, setIsLoadingUserProfile] = createSignal(true)

  // Function to check auth status - returns true if authenticated
  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const currentUser = await authService.getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        return true
      } else {
        setUser(null)
        return false
      }
    } catch (error) {
      console.error("Error checking auth status:", error)

      // If we get an error, it might be due to expired tokens
      // Clear any cached Auth0 data and reset the client
      authService.clearCache()

      setUser(null)
      return false
    }
  }

  const fetchUserProfile = async (): Promise<void> => {
    if (!user()) {
      // Don't fetch profile if not authenticated
      setIsLoadingUserProfile(false)
      return
    }

    setIsLoadingUserProfile(true)
    try {
      const profile = await api.getUserProfile()
      if (profile) {
        setUserProfile(profile)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    } finally {
      setIsLoadingUserProfile(false)
    }
  }

  // Set up periodic auth check (every 5 minutes)
  createEffect(() => {
    const interval = setInterval(
      async () => {
        // Only check if we think we're authenticated to avoid unnecessary calls
        if (user()) {
          try {
            const isStillAuthenticated = await checkAuthStatus()
            if (
              !isStillAuthenticated &&
              window.location.pathname !== "/login"
            ) {
              console.log("Auth check failed, redirecting to login")
              // Save the current path with search parameters
              sessionStorage.setItem(
                "redirectPath",
                window.location.pathname + window.location.search
              )
              // Redirect to login
              window.location.href = "/login"
            }
          } catch (error) {
            console.error("Error in auth check interval:", error)
          }
        }
      },
      5 * 60 * 1000
    ) // 5 minutes

    onCleanup(() => clearInterval(interval))
  })

  // Effect to fetch user profile when authentication state changes
  createEffect(async (prevUser) => {
    const currentUser = user()
    if (currentUser && currentUser !== prevUser) {
      await fetchUserProfile()
    }
    return currentUser
  })

  onMount(async () => {
    try {
      const isAuthenticated = await checkAuthStatus()

      // If we're not authenticated and not on the login page, redirect to login
      if (!isAuthenticated && window.location.pathname !== "/login") {
        console.log("Not authenticated, redirecting to login")
        // Save the current path with search parameters
        sessionStorage.setItem(
          "redirectPath",
          window.location.pathname + window.location.search
        )
        // Redirect to login
        window.location.href = "/login"
      }

      // We'll let the createEffect handle fetching the profile
      // when authentication changes, rather than doing it here
    } finally {
      setIsLoading(false)
    }
  })

  const signIn = async () => {
    setIsLoading(true)
    try {
      await authService.signIn()
      await checkAuthStatus() // Refresh auth status after sign in
    } catch (error) {
      console.error("Error during sign in:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      await authService.signOut()
      setUser(null)
      setUserProfile(null)
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const contextValue = {
    user: () => user(),
    isLoading: () => isLoading(),
    isLoadingUserProfile: () => isLoadingUserProfile(),
    signOut,
    signIn,
    setUser,
    checkAuthStatus,
    userProfile: () => userProfile(),
    fetchUserProfile,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
