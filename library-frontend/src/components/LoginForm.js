import { useState } from "react"
import { useMutation } from "@apollo/client"
import { LOGIN } from "../services/queries"

const LoginForm = ({ show, setToken, setLoggedIn }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [login] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error)
    },
    onCompleted: (data) => {
      setToken(data.login.value)
      setLoggedIn(true)
      setUsername("")
      setPassword("")
      localStorage.setItem("user-token", data.login.value)
    },
  })

  const loginStyle = {
    display: "inline-block",
    float: "right",
  }

  if (!show) {
    return null
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log("trying to log in with", username, password)
    login({ variables: { username, password } })
  }

  return (
    <div style={loginStyle}>
      <form onSubmit={handleLogin}>
        <input
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
export default LoginForm
