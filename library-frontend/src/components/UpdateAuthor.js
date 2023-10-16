import { useState } from "react"
import Select from "react-select"
import { useMutation } from "@apollo/client"
import { ALL_AUTHORS, EDIT_AUTHOR } from "../services/queries"

const UpdateAuthor = ({ authors }) => {
  const [setBornTo, setBirthYear] = useState("")
  const [author, setAuthor] = useState()
  const [updatedAuthorInformation] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  const updateInformation = (event) => {
    event.preventDefault()
    const name = author.value
    updatedAuthorInformation({ variables: { name, setBornTo } })
    setAuthor()
    setBirthYear("")
  }

  const options = authors.map((a) => ({ value: a.name, label: a.name }))

  return (
    <div>
      <h2>Set birthyear for author</h2>
      Author
      <Select
        options={options}
        defaultValue={options[0]}
        value={author}
        onChange={setAuthor}
      />
      <br />
      born in:
      <input
        autoFocus
        value={setBornTo}
        onChange={({ target }) => setBirthYear(target.value)}
      />
      <button onClickCapture={updateInformation}>Submit change</button>
    </div>
  )
}

export default UpdateAuthor
