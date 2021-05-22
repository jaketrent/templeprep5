const path = require('path')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use((req, res, next) => {
  res.io = io

  next()
})

io.on('connection', (socket) => {
  socket.emit('welcome')

  // handle the event sent with socket.send()
  socket.on('message', (data) => {
    console.log(data)
  })

  // handle the event sent with socket.emit()
  socket.on('salutations', (elem1, elem2, elem3) => {
    console.log(elem1, elem2, elem3)
  })
})

app.use('/nodemod', express.static(path.join(__dirname, '..', 'node_modules')))
app.use(express.static('public'))

server.listen(3001)
