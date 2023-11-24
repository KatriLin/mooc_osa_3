require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
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

app.delete('/api/persons/:id',(request,response, next) => {
  Person.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end()
  }).catch(error => next(error))
})




app.get('/info', (request,response) => {
  Person.find({}).then(persons => {
  const info = `<p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>`
  response.send(info);
 
  })
})

app.get('/api/persons/:id',(request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if(person){
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
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

app.put('/api/persons/:id',(request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, {new:true})
  .then(updatedPerson => {
    response.json(updatedPerson)
  })
  .catch(error => next(error))
})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

