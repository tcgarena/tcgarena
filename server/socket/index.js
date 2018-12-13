 module.exports = (io, miniEngine) => {
  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the arena`)
    })

    socket.on('new-mini', mini => {
      miniEngine.createMini(mini, 'socket')
    })

  })
}
