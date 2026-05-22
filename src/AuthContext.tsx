import { createContext, useContext, useState } from "react"

// defines what the context contains
interface AuthContextType {
  token: string | null                    // the JWT access token — null if not logged in
  setToken: (token: string | null) => void  // function to update the token
}

// creates the context with default empty values
const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {}
})

// wraps your entire app — any component inside can access token
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}

// shortcut hook — any component calls useAuth() to get token and setToken
export function useAuth() {
  return useContext(AuthContext)
}