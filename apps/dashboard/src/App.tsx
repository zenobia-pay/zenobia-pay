import { Router } from "@solidjs/router"
import { AuthProvider } from "./context/AuthContext"
import { routes } from "./routes"
function App() {
  return (
    <AuthProvider>
      <Router>{routes}</Router>
    </AuthProvider>
  )
}

export default App
