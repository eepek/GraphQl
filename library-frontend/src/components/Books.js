import { useEffect, useState } from "react"
import { ALL_BOOKS } from "../services/queries"
import { useQuery } from "@apollo/client"

export const updateCache = (cache, query, addedBook) => {
  const uniqueByTitle = (book) => {
    let seen = new Set()
    return book.filter((item) => {
      return seen.has(item.title) ? false : seen.add(item.title)
    })
  }

  cache.updateQuery(query, (data) => {
    console.log(data)
  })
}

const Books = (props) => {
  const { data, refetch } = useQuery(ALL_BOOKS, { fetchPolicy: "network-only" })

  const [books, setBooks] = useState([])
  const [genres, setGenres] = useState([])

  useEffect(() => {
    refetch({ genre: null })
  }, [props.show]) //eslisnt-disable-line

  useEffect(() => {
    let booksByGenre = []

    if (data) {
      data.allBooks.map((b) =>
        booksByGenre.push({
          title: b.title,
          author: b.author.name,
          published: b.published,
          genres: b.genres,
        })
      )
    }

    const allgenres = []
    booksByGenre.map((b) =>
      //This is fine as long as the table is fairly small, but imho could be done prettier
      b.genres.map((g) => (allgenres.includes(g) ? g : allgenres.push(g)))
    )
    if (allgenres.length > genres.length) {
      setGenres(allgenres)
    }

    setBooks(booksByGenre)
  }, [data]) //eslint-disable-line

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map((g) => (
        <button
          key={g}
          onClickCapture={() => {
            refetch({ genre: g })
          }}
        >
          {g}
        </button>
      ))}
      <button onClickCapture={() => refetch({ genre: null })}>
        All genres
      </button>
    </div>
  )
}

export default Books
