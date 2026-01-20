const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err))
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true })
const User = mongoose.model('User', userSchema)
app.get('/', (req, res) => {
  res.render('Home')
})

app.get('/db', async (req, res) => {
  const users = await User.find()
  res.render('db', { users })
})

app.post('/action', async (req, res) => {
  try {
    const { name, email } = req.body

    await User.create({ name, email })

    res.redirect('/db')
  } catch (err) {
    if (err.code === 11000) {
      return res.send("Email already exists")
    }
    res.status(500).send("Something went wrong")
  }
})
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})