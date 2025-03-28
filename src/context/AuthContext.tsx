import {
  createContext,
  useContext,
  createSignal,
  onMount,
  ParentComponent,
  createEffect,
  onCleanup,
} from "solid-js"
import { authService, UserProfile } from "../services/auth"

interface AuthContextType {
  user: () => UserProfile | null
  isLoading: () => boolean
  signOut: () => Promise<void>
  signIn: () => Promise<void>
  setUser: (user: UserProfile | null) => void
  checkAuthStatus: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType>()

export const AuthProvider: ParentComponent = (props) => {
  const [user, setUser] = createSignal<UserProfile | null>(null)
  const [isLoading, setIsLoading] = createSignal(true)

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
      setUser(null)
      return false
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
              // Save the current path
              sessionStorage.setItem("redirectPath", window.location.pathname)
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

  onMount(async () => {
    try {
      await checkAuthStatus()
    } finally {
      setIsLoading(false)
    }
  })

  const signIn = async () => {
    setIsLoading(true)
    try {
      await authService.signIn()
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
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const contextValue = {
    user: () => user(),
    isLoading: () => isLoading(),
    signOut,
    signIn,
    setUser,
    checkAuthStatus,
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
