const {Mini} = require("../../db/models")

class MiniInstance {
  constructor(mini) {
    // mimics the attributes of whatever obj you pass it...
    // will probably change this later to be specific
    Object.keys(mini).forEach( key => this[key] = mini[key] )
  }

  start() {

    console.log(`starting mini ${this.id}`)

  }
}

module.exports = class Engine {
  constructor(sockets) {
    this.sockets = sockets
    this.minis = {}
  }

  startMini(miniId) {
    this.minis[miniId].start()
  }

  async createMini(mini) {
    try {
      const newMini = await Mini.create(mini)
      const miniInstance = new MiniInstance(mini)
      this.minis[miniInstance.id] = miniInstance
      this.sockets.emit('new-mini', newMini.id)
      return miniInstance
    } catch(e) {
      console.log(e)
      return false
    }
  }

}