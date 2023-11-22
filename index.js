require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
const Person = require('./models/person')



morgan.token('body', (request) => {
  if (request.method === 'POST'){
  return JSON.stringify(request.body)
}
return ' '
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))




app.get('/api/persons', (request,response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
})

app.delete('/api/persons/:id',(request,response) => {
  const id = Number(request.params.id)
  const updatedPersons = persons.filter(person => person.id !== id);
  persons = updatedPersons;
  response.status(204).end()
})




app.get('/info', (request,response) => {
  const date_time = new Date();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const personscount = persons.length;
  const info = `Phonebook has info for ${personscount} people`;
  const time = `${date_time.toDateString()} ${date_time.toTimeString()} ${timeZone}  `
  const fullInfo = `${info}<br>${time}`;
  response.send(fullInfo);
})

app.get('/api/persons/:id',(request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons',(request,response) => {
  const body = request.body
  if (!body.name|| !body.number){
    return response.status(400).json({
      error: "Name or/and number is missing"
    })
  }
 

  const person = new Person ({
    name: body.name,
    number: body.number,
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

