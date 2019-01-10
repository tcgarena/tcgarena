import io from 'socket.io-client'
import store, { fetchMini, socketUpdate } from './store';

const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log('Connected!')

  socket.on('fetch-mini', uuid =>{
    console.log('uuid',uuid)
    store.dispatch(fetchMini(uuid))
  })

  socket.on('update-mini', (uuid, update) => {
    store.dispatch(socketUpdate(uuid, update))
  })

})

export default socket
