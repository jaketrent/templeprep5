const path = require('path')
const ejs = require('ejs')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const PORT = process.env.PORT || 3001

app.set('views', path.join(__dirname, 'views'))
app.engine('html', ejs.renderFile)
app.set('view engine', 'html')

app.use((req, res, next) => {
  res.io = io

  next()
})

let clientState = { i: 0 }

io.on('connection', (socket) => {
  socket.emit('welcome', clientState)

  // handle the event sent with socket.send()
  socket.on('message', (data) => {
    console.log(data)
  })

  // handle the event sent with socket.emit()
  socket.on('advancing', (state) => {
    clientState = state
    console.log('advancing to', clientState)
    io.emit('advance', clientState)
  })
})

app.get('/', (req, res) => {
  res.render('index', {
    serverHost: process.env.SERVER_HOST || 'http://localhost:' + PORT,
  })
})

app.use('/nodemod', express.static(path.join(__dirname, '..', 'node_modules')))
app.use(express.static('public'))

server.listen(PORT)
