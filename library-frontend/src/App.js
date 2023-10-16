import { useState, useEffect } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import LoginForm from "./components/LoginForm"
import Recommended from "./components/Recommended"
import { useApolloClient, useQuery, useSubscription } from "@apollo/client"
import { ALL_BOOKS, BOOK_ADDED, ME } from "./services/queries"
import { updateCache } from "./components/Books"

const App = () => {
  const [page, setPage] = useState("authors")
  const [token, setToken] = useState(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const { refetch } = useQuery(ME, {
    onCompleted: (data) => {
      setUser(data.me)
    },
  })
  const [user, setUser] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    refetch()
  }, [loggedIn]) //eslint-disable-line

  const logOut = () => {
    setToken(null)
    setUser(null)
    setPage("authors")
    localStorage.clear()
    client.resetStore()
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const alertText = `${data.data.bookAdded.title} by ${data.data.bookAdded.author.name} has been added to books`
      window.alert(alertText)
      updateCache(client.cache, { query: ALL_BOOKS }, data.data.bookAdded)
    },
  })

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {!token ? null : (
          <button onClick={() => setPage("add")}>add book</button>
        )}
        {!token ? null : (
          <button onClick={() => setPage("recommended")}>recommended</button>
        )}
        {token ? (
          <div style={{ display: "inline-block", float: "right" }}>
            {user.username} logged in
          </div>
        ) : null}
        {!token ? (
          <LoginForm
            show={!token ? true : false}
            setToken={setToken}
            setLoggedIn={setLoggedIn}
          />
        ) : (
          <button onClick={() => logOut()}>log out</button>
        )}
      </div>

      <Authors show={page === "authors"} loggedIn={loggedIn} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} setPage={setPage} />

      <Recommended show={page === "recommended"} user={user} />
    </div>
  )
}

export default App
