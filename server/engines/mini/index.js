class Mini {
  constructor(mini) {
    // mimics the attributes of whatever obj you pass it...
    // will probably change this later to be specific
    Object.keys(mini).forEach( key => this[key] = mini[key] )
  }

  start() {

    console.log(this)

  }
}

module.exports = class Engine {
  constructor(sockets) {
    this.sockets = sockets
    this.minis = {}
  }

  startMini(miniId) {
    this.minis[miniId].start()
    this.sockets.emit('new-mini', miniId)
  }

  // must be called once from api route and once from socket
  createMini (mini, source) {
    /* mini[source] = bool =>
        mini.socket = false
        mini.api = false
    */

    // prevents them from creating a tournament by sending
    // a create mini socket action with { ...mini, api: true }
    const {
      api: _,
      ...cleanMini
    } = mini
    
    const existingMini = this.minis[cleanMini.id]

    if (existingMini) {

      switch (source) {

        case 'socket':
          existingMini.socket = true
          if (existingMini.api) 
            // we are using existingMini here because the id comes from the secure api route
            this.startMini(existingMini.id)
          break

        case 'api':
          existingMini.api = true
          if (existingMini.socket) 
            // same here, can't trust the id coming from the socket
            this.startMini(mini.id)
          break
          
      }

    } else {

      this.minis[cleanMini.id] = new Mini({
        ...cleanMini,
        [source]: true
      })
      
    }
  }

}