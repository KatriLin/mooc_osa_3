const express = require('express')
const app = express()
app.use(express.json())
const morgan = require('morgan')

{/*morgan.token('tiny', function (req, res) {
  return `${req.method} ${req.url} ${res.statusCode}`;
});


app.use(morgan(':tiny'));*/}

morgan.token('body', (request) => {
  if (request.method === 'POST'){
  return JSON.stringify(request.body)
}
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
      id: 2,
      name: "Ada Lovelace",
      number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "050-333444"
      },
      {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423455"
      },
  ]
app.get('/api/persons', (request,response) => {
    response.json(persons)
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
 
  const nameAlreadyExist = persons.find((person) => person.name === body.name);

  if(nameAlreadyExist){
    return response.status(409).json({
      error: "Person with the same name already exists"
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 1000) + 1
  }
  persons =persons.concat(person)

  response.json(person)
})
  const PORT = 3001
app.listen(PORT)

console.log(`Server running on port ${PORT}`)