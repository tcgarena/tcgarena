import io from 'socket.io-client'
import store, { fetchMini, socketUpdate, me, removeMiniById } from './store';

const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log('Connected!')

  socket.on('fetch-mini', uuid =>{
    store.dispatch(fetchMini(uuid))
  })

  socket.on('remove-mini', uuid => {
    store.dispatch(removeMiniById(uuid))
  })

  socket.on('update-mini', (uuid, update) => {
    store.dispatch(socketUpdate(uuid, update))
  })

  socket.on('update-users', (userIds) => {
    userIds.forEach(id => {
      if (store.getState().user.id === id) {
        store.dispatch(me())
      }
    })
  })

})

export default socket
