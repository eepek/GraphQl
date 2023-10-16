const { GraphQLError } = require("graphql")
const jwt = require("jsonwebtoken")
const Book = require("./Models/Book")
const Author = require("./Models/Author")
const User = require("./Models/User")
const { PubSub } = require("graphql-subscriptions")
const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      console.log(args.genre)
      let books = []
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        books = await Book.find({ author: author._id }).populate("author")
        if (args.genre) {
          books = books.filter((book) => book.genres.includes(args.genre))
        }
        return books
      } else if (args.genre) {
        console.log("Täällä ollaan")
        const genre = args.genre
        const genreBooks = await Book.find({ genres: genre }).populate("author")
        console.log(genreBooks)
        return genreBooks
      } else {
        return Book.find({}).populate("author")
      }
    },
    allAuthors: async () => Author.find({}),
    me: async (root, args, context) => {
      return context.currentUser
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      console.log("ollaan backendissä", args)
      if (!context.currentUser) {
        throw new GraphQLError("Unauthorized", {
          extensions: {
            code: "FORBIDDEN",
          },
        })
      }
      let authorInDb = await Author.findOne({ name: args.author })
      if (!authorInDb) {
        const author = new Author({ name: args.author })
        try {
          authorInDb = await author.save()
        } catch (error) {
          throw new GraphQLError("Author name is too short", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
              error,
            },
          })
        }
      }
      const book = await new Book({ ...args, author: authorInDb }).populate(
        "author"
      )
      console.log("the book is : ", book)
      try {
        const savedBook = await book.save()
        pubsub.publish("BOOK_ADDED", { bookAdded: savedBook })
        return savedBook
      } catch (error) {
        throw new GraphQLError("Book name is too short or already exists", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error,
          },
        })
      }
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Unauthorized", {
          extensions: {
            code: "FORBIDDEN",
          },
        })
      }
      const updatedAuthor = await Author.findOne({ name: args.name })
      if (!updatedAuthor) {
        return null
      }

      updatedAuthor.born = args.setBornTo

      return updatedAuthor.save()
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favouriteGenre: args.favouriteGenre,
      })
      return user.save().catch((error) => {
        throw new GraphQLError("User creation failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: [args.username, args.favouriteGenre],
            error,
          },
        })
      })
    },
    login: async (root, args) => {
      console.log("login attempt", args.username)
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== "groovy") {
        throw new GraphQLError("Invalid password or username", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      const value = { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
      console.log(value)
      return value
    },
  },
  Author: {
    bookCount: (root) => {
      return Book.collection.countDocuments({ author: root._id })
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
}

module.exports = resolvers
