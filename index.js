const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan('tiny', {
    skip: function (req, res) { return req.method === "POST" }
}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
    skip: function (req, res) { return req.method != "POST" }
}))

let persons = [
    {id: 1, name: "Arto Hellas", number: "040-123456"},
    {id: 2, name: "Ada Lovelace", number: "39-44-5323523"},
    {id: 3, name: "Dan Abramov", number: "12-43-234345"},
    {id: 4, name: "Mary Poppendieck", number: "39-23-6423122"}
  ]

app.get('/info', (req, res) => {
    var asd = persons.length
    var date = new Date().toString()
    res.send(`
    <div>Phoenebook has info for ${asd} people</div>
    <div>${date}</div>
    `)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = persons.find(name => name.id === id)
    if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(name => name.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    persons.filter(person => person.name == body.name)

    if (!body.name) {
        return response.status(400).json({ 
            error: 'Name missing' 
        })
    }
    else if(!body.number) {
        return response.status(400).json({ 
            error: 'Number missing' 
        })
    }     
    else if(persons.filter(person => person.name == body.name).length != 0) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    } 
    const note = {
        id: Math.floor(Math.random() * 1000),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(note)
    response.json(note)
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})