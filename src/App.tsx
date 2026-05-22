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
  <div className="container">
    <h2>Create Account</h2>
    <div className="form-group">
      <input type="text" placeholder="Full name" value={name}
        onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password}
        onChange={(e) => setPassword(e.target.value)} />
      <button className="btn btn-primary" onClick={handleSubmit}>Register</button>
    </div>
    <p className="message">{message}</p>
    <p className="switch-text">
      Already have an account?{" "}
      <span onClick={onSwitch}>Login</span>
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
  <div className="container">
    <h2>Welcome back</h2>
    <div className="form-group">
      <input type="email" placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password}
        onChange={(e) => setPassword(e.target.value)} />
      <button className="btn btn-primary" onClick={handleSubmit}>Login</button>
      <button className="btn btn-github"
        onClick={() => window.location.href = "http://localhost:8000/auth/github"}>
        Login with GitHub
      </button>
    </div>
    <p className="message">{message}</p>
    <p className="switch-text">
      No account?{" "}
      <span onClick={onSwitch}>Register</span>
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
  <div className="dashboard">
    <h2>Dashboard</h2>
    <p>Welcome back, <strong>{user.name}</strong></p>
    <p>Email: {user.email}</p>
    <button className="btn btn-danger" onClick={handleLogout}
      style={{ marginTop: "20px" }}>
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
    {showRegister
      ? <RegisterForm onSwitch={() => setShowRegister(false)} />
      : <LoginForm onSwitch={() => setShowRegister(true)} />
    }
  </div>
)
}

export default App