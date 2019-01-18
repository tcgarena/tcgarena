const MiniInstance = require('./Mini')
const {Mini} = require("../../db/models")
const uuidv4 = require('uuid/v4');

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

  getMini(uuid) {
    return this.minis[uuid].clientData
  }

  async loadMinis() {
    // reload minis just in case the server restarts/crashes while there are active minis
    try {
      const minis = await Mini.fetchActive()
      Object.keys(minis).forEach(async key => {
        const mini = minis[key]
        const miniInstance = new MiniInstance(mini, this.sockets)
        await miniInstance.getUuid()
        this.minis[miniInstance.uuid] = miniInstance
      })
    } catch (e) {
      console.error(e)
    }
  }

  startMini(userId, uuid) {
    // will probably add some userId checks later on
    try {
      if (this.minis[uuid].clientData.state === 'open') {
        this.minis[uuid].start()
      } else if (this.minis[uuid].clientData.state === 'active') {
        throw new Error(`mini ${uuid} already active`)
      }
    } catch (e) {
      console.error(e)
    }
  }

  nextRound(userId, uuid) {
    // will probably add some userId checks later on
    try {
      if (this.minis[uuid].clientData.state === 'round-over') {
        this.minis[uuid].nextRound()
      } else if (this.minis[uuid].clientData.state === 'active') {
        throw new Error(`not all matches reported for mini ${uuid}`)
      } else if (this.minis[uuid].clientData.state === 'open') {
        throw new Error(`mini ${uuid} has not started yet`)
      }
    } catch (e) {
      console.error(e)
    }
  }

  async joinMini(userId, uuid, deckId) {
    try {
      const miniId = this.minis[uuid].id
      const {dataValues: userMini} = await Mini.join(miniId, userId, deckId)
      const {cockatriceName, ELO, deckhash, decklist} = userMini
      if (this.minis[uuid]) {
        this.minis[uuid].users[userId] = {
          cockatriceName, ELO, deckhash, decklist,
          id: userId, 
          uuid: uuidv4()
        }
        this.minis[uuid].buildClientData()
        this.sockets.emit('update-mini', uuid, {
          participants: this.minis[uuid].clientData.participants
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  removeResult(userId, miniUuid, matchUuid) {
    this.minis[miniUuid].removeResult(userId, matchUuid)
  }

  async createMini(mini) {
    try {
      const newMini = await Mini.create(mini)
      const miniInstance = new MiniInstance(newMini, this.sockets)
      await miniInstance.getUuid()
      this.minis[miniInstance.uuid] = miniInstance
      this.sockets.emit('fetch-mini', miniInstance.uuid)
      return miniInstance.clientData
    } catch(e) {
      console.error(e)
      return false
    }
  }

  async results(userId, miniUuid, matchUuid, result) {
    try {
      const mini = this.minis[miniUuid]

      // make sure mini is being tracked by engine
      if (this.minis[miniUuid]) {
        const pairing = mini.pairings[matchUuid]
        
        // make sure match is being tracked
        if (pairing) {
          const pair = pairing.pair
          let myMatch = false
          for (let i=0; i<2; i++)
            myMatch = pair[i].id === userId
              ? true : myMatch

          // make sure reporting user is in the match
          if (myMatch) {

            const response = await mini.reportResult(userId, matchUuid, result.myScore, result.opponentScore)
            return response

          } else {
            // should log malicious attempt
            throw new Error(`user ${userId} is not in match ${matchUuid} mini ${miniUuid}`)
          }
        } else {
          throw new Error(`no match by uuid ${matchUuid} in mini ${miniUuid}`)
        }
      } else {
        throw new Error(`no mini by uuid ${miniUuid}`)
      }
    } catch (e) {
      console.error(e)
    }
  }

}