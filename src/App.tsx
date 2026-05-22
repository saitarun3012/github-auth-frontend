import { useState, useEffect } from "react"
import { useAuth } from "./AuthContext"

function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async () => {
    if (name === "" || email === "" || password === "") {
      setMessage("Please fill in all fields")
      return
    }
    const response = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    })
    const data = await response.json()
    if (data.message) {
      setMessage(data.message + " — please login")
    } else {
      setMessage(data.error || "Registration failed")
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "300px" }}>
      <h2>Register</h2>
      <input type="text" placeholder="Name" value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
      <input type="email" placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
      <input type="password" placeholder="Password" value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
      <button onClick={handleSubmit}
        style={{ padding: "8px", background: "green", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
        Register
      </button>
      <p>{message}</p>
      <p style={{ fontSize: "13px" }}>
        Already have an account?{" "}
        <span onClick={onSwitch} style={{ color: "blue", cursor: "pointer" }}>Login</span>
      </p>
    </div>
  )
}

function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const { setToken } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async () => {
    if (email === "" || password === "") {
      setMessage("Please fill in all fields")
      return
    }
    const formData = new FormData()
    formData.append("username", email)
    formData.append("password", password)
    const response = await fetch("http://localhost:8000/login", {
      method: "POST",
      body: formData
    })
    const data = await response.json()
    if (data.access_token) {
      setToken(data.access_token)
    } else {
      setMessage(data.error || "Login failed")
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "300px" }}>
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
      <input type="password" placeholder="Password" value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
      <button onClick={handleSubmit}
        style={{ padding: "8px", background: "blue", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
        Login
      </button>
      <button
        style={{ padding: "8px", background: "#24292e", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginTop: "4px" }}
        onClick={() => window.location.href = "http://localhost:8000/auth/github"}
      >
        Login with GitHub
      </button>
      <p>{message}</p>
      <p style={{ fontSize: "13px" }}>
        No account?{" "}
        <span onClick={onSwitch} style={{ color: "blue", cursor: "pointer" }}>Register</span>
      </p>
    </div>
  )
}

function Dashboard() {
  const { token, setToken } = useAuth()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("http://localhost:8000/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setUser(data)
    }
    fetchUser()
  }, [token])

  const handleLogout = async () => {
    await fetch("http://localhost:8000/logout", {
      method: "POST",
      credentials: "include"
    })
    setToken(null)
  }

  if (!user) return <p>Loading...</p>

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
      <p>Welcome back, <strong>{user.name}</strong></p>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout}
        style={{ marginTop: "20px", padding: "8px 16px", background: "red", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
        Logout
      </button>
    </div>
  )
}

function App() {
  const { token, setToken } = useAuth()
  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get("token")
    if (urlToken) {
      setToken(urlToken)
      window.history.replaceState({}, "", "/")
    }
  }, [])

  if (token) return <Dashboard />

  return (
    <div style={{ padding: "20px" }}>
      <h1>Auth Project</h1>
      {showRegister
        ? <RegisterForm onSwitch={() => setShowRegister(false)} />
        : <LoginForm onSwitch={() => setShowRegister(true)} />
      }
    </div>
  )
}

export default App