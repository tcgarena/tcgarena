import io from 'socket.io-client'
import store, { fetchMini, socketUpdate } from './store';

const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log('Connected!')

  socket.on('fetch-mini', miniId =>
    store.dispatch(fetchMini(miniId))
  )

  socket.on('update-mini', (miniId, update) => {
    store.dispatch(socketUpdate(miniId, update))
  })

})

export default socket
