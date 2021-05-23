const path = require('path')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const PORT = process.env.PORT || 3001

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

app.use('/nodemod', express.static(path.join(__dirname, '..', 'node_modules')))
app.use(express.static('public'))

server.listen(PORT)
