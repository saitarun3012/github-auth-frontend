import { createContext, useContext, useState } from "react"

interface AuthContextType {
  token: string | null                    
  setToken: (token: string | null) => void  
}

// creates the context with default empty values
const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}


export function useAuth() {
  return useContext(AuthContext)
}