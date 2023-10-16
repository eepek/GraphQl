import { useQuery } from "@apollo/client"
import { ALL_AUTHORS } from "../services/queries"
import UpdateAuthor from "./UpdateAuthor"

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)

  if (!props.show) {
    return null
  }
  const authors = []

  if (!result.loading) {
    result.data.allAuthors.map((a) =>
      authors.push({ name: a.name, born: a.born, bookCount: a.bookCount })
    )
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.loggedIn ? <UpdateAuthor authors={authors} /> : null}
    </div>
  )
}

export default Authors
