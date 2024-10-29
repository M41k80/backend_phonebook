const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person.cjs')

const app = express()

// const url = `mongodb+srv://m41k80:${process.env.MONGO_PASSWORD}@cluster1.qeukk.mongodb.net/phonebook?retryWrites=true&w=majority`

// mongoose.set('strictQuery', false)
// mongoose.connect(url)
//   .then(() => {
//     console.log('connected to MongoDB')
//   })
//   .catch((err) => {
//     console.error('error connecting to MongoDB:', err.message)
//   })

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// })

// const Person = mongoose.model('Person', personSchema)

app.use(cors())
// app.use(express.static('build'))
app.use(express.json())
// app.use(morgan('tiny'))

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/api/persons/info', (req, res) => {
  Person.countDocuments({})
    .then(count => {
      res.send(
        `<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>` )
    })
      
     })


app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
  .catch(error => {
    console.error('error fetching person:', error)
    res.status(404).send({error: 'server error'})
  })
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number is missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson);
  })
  .catch(error => next(error))

})


app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  const updatedPerson = {
    name: body.name,
    number: body.number,
  }
  
  Person.findByIdAndUpdate(req.params.id, updatedPerson, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})


app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}


app.use(unknownEndpoint)
// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(errorHandler)



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})



// const express = require('express')
// const cors = require('cors')
// const morgan = require('morgan')
// const bodyParser = require('body-parser')

// const app = express()

// app.use(cors())
// app.use(express.static('dist'))

// app.use(bodyParser.json())

// morgan.token('body', (req) => JSON.stringify(req.body))

// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }
// app.use(express.json())
// app.use(requestLogger)

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' })
// }

// let persons = [
//     {
//       "id": 1,
//       "name": "Arto Hellas",
//       "number": "040-123456"
//     },
//     {
//       "id": 2,
//       "name": "Ada Lovelace",
//       "number": "39-44-5323523"
//     },
//     {
//       "id": 3,
//       "name": "Dan Abramov",
//       "number": "12-43-234345"
//     },
//     {
//       "id": 4,
//       "name": "Mary Poppendieck",
//       "number": "39-23-6423122"
//     }
// ]

// 

// app.get('/api/persons', (request, response) => {
//     response.json(persons)
//   })


// app.get('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     console.log(id)
//     const person = persons.find(person => {
//       console.log(person.id, typeof person.id, id, typeof id, person.id === id)
//       return person.id === id
//     })
//     if (person) {
//       response.json(person)
//     } else {
//       response.status(404).end()
//     }
    
//   })

// app.delete('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     persons = persons.filter(person => person.id !== id)
  
//     response.status(204).end()
//   })

//   const generateId = () => {
//     const maxId = persons.length > 0
//       ? Math.max(...persons.map(p => p.id))
//       : 0
//     return maxId + 1
//   }
  
// app.post('/api/persons', (request, response) => {
//     const body = request.body
  
//     if (!body.name && !body.number) {
//       return response.status(400).json({ 
//         error: 'name or number is missing' 
//       })
//     }
  
//     const person = {
//       id: generateId(),
//       name: (body.name),
//       number: (body.number),
      
//     }

//     if(persons.find(p => p.name === person.name)){
//       return response.status(400).json({ 
//         error: 'name must be unique' 
//       })
//     }
  
//     persons = persons.concat(person)
  
//     response.json(person)
//   })

  
// app.use(unknownEndpoint)
 
  
//   const PORT = process.env.PORT || 3001
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`)
//   })