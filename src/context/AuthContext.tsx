import {
  createContext,
  useContext,
  createSignal,
  onMount,
  ParentComponent,
} from "solid-js"
import { authService } from "../services/auth"

interface AuthContextType {
  user: () => any | null
  isLoading: () => boolean
  signOut: () => Promise<void>
  signIn: () => Promise<void>
  setUser: (user: any) => void
}

const AuthContext = createContext<AuthContextType>()

export const AuthProvider: ParentComponent = (props) => {
  const [user, setUser] = createSignal<any | null>(null)
  const [isLoading, setIsLoading] = createSignal(true)

  onMount(async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  })

  const signIn = async () => {
    setIsLoading(true)
    try {
      await authService.signIn()
    } catch (error: any) {
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
