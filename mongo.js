const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://lindvallkatri:${password}@cluster0.tenkxus.mongodb.net/?retryWrites=true&w=majority`
  

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type : String, 
    minlength : 8,
    validate : {
      validator : function(v) {
        return /^\d{2,3}-\d{7,}/.test(v)
      },
      message : props => `${props.value} is not a valid phone number!`
    },
    required : true
  },
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 4){
  const name = process.argv[3]
  const number = process.argv[4]

const person = new Person({
  name: name,
  number: number,
  
})

person.save().then(result => {
  console.log(`added ${result.name} number ${result.number} to phonebook`)
  mongoose.connection.close()
})
} else {
console.log('phonebook:')
Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person.name, person.number)
  })
  mongoose.connection.close()
})
}