import io from 'socket.io-client'
import store, { fetchMini } from './store';

const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log('Connected!')

  socket.on('new-mini', miniId =>
    store.dispatch(fetchMini(miniId))
  )

  socket.on('test', msg => console.log('weeeee'))

})

export default socket
