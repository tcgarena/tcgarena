const {Mini} = require("../../db/models")

class MiniInstance {
  constructor(mini) {
    // mimics the attributes of whatever obj you pass it...
    // will probably change this later to be specific
    Object.keys(mini).forEach( key => this[key] = mini[key] )
  }

  async start() {
    try {
      const mini = await Mini.startMini(this.id)
    } catch (e) {
      console.error(e)
    }
  }
}

module.exports = class Engine {
  constructor(sockets) {
    this.sockets = sockets
    this.minis = {}
  }

  async loadMinis() {
    // reload minis just in case the server restarts/crashes while there are active minis
    try {
      const minis = await Mini.fetchActive()
      Object.keys(minis).forEach(key => {
        const mini = minis[key]
        const miniInstance = new MiniInstance(mini)
        this.minis[miniInstance.id] = miniInstance
      })
    } catch (e) {
      console.error(e)
    }
  }

  startMini(userId, miniId) {
    // will probably add some userId checks later on
    this.minis[miniId].start()
  }

  async joinMini(userId, miniId, decklist) {
    const {dataValues: mini} = await Mini.join(miniId, userId, decklist)
    if (mini) {
      this.minis[miniId] = mini
      this.sockets.emit('fetch-mini', miniId)
    }
  }

  async createMini(mini) {
    try {
      const newMini = await Mini.create(mini)
      const miniInstance = new MiniInstance(mini)
      this.minis[miniInstance.id] = miniInstance
      this.sockets.emit('fetch-mini', newMini.id)
      return miniInstance
    } catch(e) {
      console.log(e)
      return false
    }
  }

}