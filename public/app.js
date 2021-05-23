const prev = document.querySelector('#prev')
const next = document.querySelector('#next')

prev.addEventListener('click', handlePrev)
next.addEventListener('click', handleNext)

const slides = document.querySelectorAll('.slide')
log(slides)
let state = {
  i: -1,
}

const socket = io(window.SERVER_HOST)

socket.on('welcome', handleWelcome)
socket.on('advance', handleAdvance)

function handlePrev() {
  log('prev')
  const newI = state.i - 1
  state.i = newI < 0 ? 0 : newI
  socket.emit('advancing', state)
}

function handleNext() {
  log('next')
  const newI = state.i + 1
  state.i = newI >= slides.length - 1 ? slides.length - 1 : newI
  socket.emit('advancing', state)
}

function handleWelcome(initialState) {
  document.querySelector('#root').innerHTML = ''
  state = initialState

  log('welcome')
  slide(state.i).show()
}

function handleAdvance(newState) {
  state = newState

  log('advance', state)
  slide(state.i).show()
}

function log() {
  console.log.apply(this, arguments)
}

function slide(nameOrIndex) {
  let el
  if (typeof nameOrIndex === 'string')
    el = document.querySelector('.slide--' + nameOrIndex)
  else el = document.querySelectorAll('.slide')[nameOrIndex]

  return {
    show() {
      slides.forEach((slide) => slide.classList.remove('slide--show'))
      el.classList.add('slide--show')
    },
  }
}
