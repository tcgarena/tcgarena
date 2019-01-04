const MiniInstance = require('./Mini')
const {Mini} = require("../../db/models")

module.exports = class Engine {
  constructor(sockets) {
    this.sockets = sockets
    this.minis = {}
  }

  getMinis() {
    return Object.keys(this.minis).reduce( (obj, key) => {
      obj[key] = this.minis[key].clientData
      return obj
    }, {})
  }

  async loadMinis() {
    // reload minis just in case the server restarts/crashes while there are active minis
    try {
      const minis = await Mini.fetchActive()
      Object.keys(minis).forEach(key => {
        const mini = minis[key]
        const miniInstance = new MiniInstance(mini, this.sockets)
        this.minis[miniInstance.id] = miniInstance
      })
    } catch (e) {
      console.error(e)
    }
  }

  startMini(userId, miniId) {
    // will probably add some userId checks later on
    try {
      if (this.minis[miniId].clientData.state === 'open') {
        this.minis[miniId].start()
      } else if (this.minis[miniId].clientData.state === 'active') {
        throw new Error(`mini ${miniId} already active`)
      }
    } catch (e) {
      console.error(e)
    }
  }

  async joinMini(userId, miniId, deckId) {
    try {
      const {dataValues: userMini} = await Mini.join(miniId, userId, deckId)
      const {cockatriceName, ELO, deckhash, decklist} = userMini
      if (this.minis[miniId]) {
        this.minis[miniId].users[userId] = {
          cockatriceName, ELO, deckhash, decklist,
          id: userId
        }
        this.minis[miniId].buildClientData()
        this.sockets.emit('update-mini', miniId, {
          participants: this.minis[miniId].clientData.participants
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  async createMini(mini) {
    try {
      const newMini = await Mini.create(mini)
      const miniInstance = new MiniInstance(mini, this.sockets)
      this.minis[newMini.id] = miniInstance
      this.sockets.emit('fetch-mini', newMini.id)
      return miniInstance
    } catch(e) {
      console.error(e)
      return false
    }
  }

}