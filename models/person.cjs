const mongoose = require('mongoose')


const url = `mongodb+srv://m41k80:${process.env.MONGO_PASSWORD}@cluster1.qeukk.mongodb.net/phonebook?retryWrites=true&w=majority`
console.log('Password:', process.env.MONGO_PASSWORD)// For debugging only

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((err) => {
    console.error('error connecting to MongoDB:', err.message)
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d{7,8}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required'],
    minlength: 8
  }
})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


const Person = mongoose.model('Person', personSchema)
module.exports = Person