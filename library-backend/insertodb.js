const mongoose = require("mongoose")
mongoose.set("strictQuery", false)
const Book = require("./Models/Book")
const Author = require("./Models/Author")

require("dotenv").config()

const DB_URI = process.env.MONGO_DB_URI

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Yhdistettiin MongoDB")
  })
  .catch((error) => {
    console.log("Problemz", error.message)
  })

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: {
      name: "Robert Martin",
      born: 1952,
    },
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: {
      name: "Robert Martin",
      born: 1952,
    },
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: {
      name: "Martin Fowler",
      born: 1963,
    },
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: {
      name: "Joshua Kerievsky", // birthyear not known
    },
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: {
      name: "Sandi Metz", // birthyear not known
    },
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: {
      name: "Fyodor Dostoevsky",
      born: 1821,
    },
    genres: ["classic", "crime"],
  },
  {
    title: "The Demon ",
    published: 1872,
    author: {
      name: "Fyodor Dostoevsky",
      born: 1821,
    },
    genres: ["classic", "revolution"],
  },
]

const getAuthors = async () => {
  const authors = await Author.find({})
  books.map((book) => {
    const authorofbook = authors.find((a) => a.name === book.author.name)
    console.log(authorofbook._id)
    book.author = authorofbook._id
  })
  Book.insertMany(books)
    .then(() => {
      console.log("lisättiin kirjoja", Book.collection.countDocuments())
    })
    .catch((error) => {
      console.log("error", error)
    })
}

getAuthors()

// Author.insertMany(authors)
//   .then( async () => {
//     console.log("lisättiin kirjailijoita", Author.collection.countDocuments())
//   })
//   .catch((error) => {
//     console.log(error)
//   })
