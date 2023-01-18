import express from 'express'
import notesDb from './db/notesDb.js'
import cors from 'cors'

const app = express()

let notes = notesDb

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  console.log(req.method)
  console.log(req.path)
  console.log(req.body)
  console.log('-----------------')
  next()
})

app.get('/', (req, res) => {
  res.send('<h1>Hi word</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res, next) => {
  const id = req.params.id
  const note = notes.find((note) => note.id === id)

  if (note) {
    res.send(note)
  } else {
    next()
  }
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter((note) => note.id !== id)
  res.status(204).end()
})

app.post('/api/notes', (req, res) => {
  const note = req.body

  if (!note || !note.content) {
    return res.status(400).json({
      error: 'note.content is missing'
    })
  }
  const ids = notes.map((note) => note.id)
  const maxids = Math.max(...ids)
  const newNote = {
    id: maxids + 1,
    content: note.content,
    import: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }
  notes = [...notes, newNote]
  res.status(201).json(newNote)
})

app.use((req, res, next) => {
  res.json({
    error: 'Not path found'
  })
})

const PORT = 3000
app.listen(PORT, () => console.log(`Server on port: ${PORT}`))
