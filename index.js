const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
 
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
 
 morgan.token('body', (request) => JSON.stringify(request.body))
 
 app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send("<h1>Phonebook</h1>")
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if(person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    const date = new Date()

    response.send(`Phone book has info for ${persons.length} persons </br> ${date}`)
})

app.delete('api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id != id)

    response.status(204).end()
})

const generateId = () => {
    const id = Math.floor(Math.random() * 1000)
    return String(id)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    const currentName = persons.find(person => person.name === body.name)

    if(currentName) {
        return response.status(400).json({
            error: 'name already exists'
        })
    }

    if(!body.name ) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if(!body.number ) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})