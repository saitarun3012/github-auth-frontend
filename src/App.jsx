import { useState } from "react"

function RegisterForm() {
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
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({name, email, password})
    })

    const data = await response.json()

    if (data.message) {
      setMessage(data.message)
    } else {
      setMessage(data.error || "Registration failed")
    }
  }

  return (
    <div style={{display:"flex", flexDirection:"column", gap:"10px", width:"300px"}}>
      <h2>Register</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{padding:"8px", border:"1px solid #ccc", borderRadius:"4px"}}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{padding:"8px", border:"1px solid #ccc", borderRadius:"4px"}}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{padding:"8px", border:"1px solid #ccc", borderRadius:"4px"}}
      />

      <button
        onClick={handleSubmit}
        style={{padding:"8px", background:"green", color:"white", border:"none", borderRadius:"4px", cursor:"pointer"}}
      >
        Register
      </button>

      <p>{message}</p>
    </div>
  )
}

function LoginForm() {
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
      setMessage(`Logged in successfully — token received`)
    } else {
      setMessage(data.error || "Login failed")
    }
  }

  return (
    <div style={{display:"flex", flexDirection:"column", gap:"10px", width:"300px"}}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{padding:"8px", border:"1px solid #ccc", borderRadius:"4px"}}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{padding:"8px", border:"1px solid #ccc", borderRadius:"4px"}}
      />

      <button
        onClick={handleSubmit}
        style={{padding:"8px", background:"blue", color:"white", border:"none", borderRadius:"4px", cursor:"pointer"}}
      >
        Login
      </button>

      <p>{message}</p>
    </div>
  )
}

function App() {
  return (
    <div style={{padding:"20px"}}>
      <h1>Auth Project</h1>
      <RegisterForm />
      <LoginForm />
    </div>
  )
}

export default App