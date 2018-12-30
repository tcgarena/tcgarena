const {Mini} = require("../../db/models")

class MiniInstance {
  constructor(mini) {
    // mimics the attributes of whatever obj you pass it...
    // will probably change this later to be specific
    this.participants = {}
    Object.keys(mini).forEach( key => this[key] = mini[key] )
  }

  pair() {

  }

  async refresh() {
    try {
      const mini = await Mini.fetchById(this.id)
      Object.keys(mini).forEach( key => this[key] = mini[key] )
    } catch (e) {
      console.error()
    }
  }

  async start() {
    try {
      await Mini.update(
        {state: 'active'},
        {where: {id: this.id}}
      )
      await this.refresh()
      this.pair()
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
    try {
      if (this.minis[miniId].state === 'open') {
        this.minis[miniId].start()
        this.sockets.emit('update-mini', miniId, {state: 'active'})
      } else if (this.minis[miniId].state === 'active') {
        throw new Error(`mini ${miniId} already active`)
      }
    } catch (e) {
      console.error(e)
    }
  }

  async joinMini(userId, miniId, deckId) {
    try {
      const {dataValues: userMini} = await Mini.join(miniId, userId, deckId)
      if (this.minis[miniId]) {
        this.minis[miniId].participants[userId] = {
          userId, miniId, 
          decklist: userMini.decklist,
          deckhash: userMini.deckhash
        }
        this.sockets.emit('update-mini', miniId, 
          {participants: this.minis[miniId].participants}
        )
      }
    } catch (e) {
      console.error(e)
    }
  }

  async createMini(mini) {
    try {
      const newMini = await Mini.create(mini)
      const miniInstance = new MiniInstance(mini)
      this.minis[newMini.id] = miniInstance
      this.sockets.emit('fetch-mini', newMini.id)
      return miniInstance
    } catch(e) {
      console.log(e)
      return false
    }
  }

}