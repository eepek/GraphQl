import { useQuery } from "@apollo/client"
import { RECOMMEND_BOOKS } from "../services/queries"

const Recommended = ({ show, user }) => {
  const genre = user ? user.favouriteGenre : null
  const result = useQuery(RECOMMEND_BOOKS, {
    variables: { genre },
  })
  const books = []

  if (!show) {
    return null
  }

  if (!result.loading) {
    result.data.allBooks.map((b) =>
      books.push({ title: b.title, author: b.author, published: b.published })
    )
  }

  return (
    <div>
      <h2>Recommendations</h2>
      <p>
        books in your favourite genre <b>{genre}</b>
      </p>
      <table>
        <thead>
          <tr>
            <td>book</td>
            <td>author</td>
            <td>published</td>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended
