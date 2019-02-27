const uuidv4 = require('uuid/v4')
const MiniInstance = require('./Mini')
const {Mini, Deck, User, UserMini} = require("../../db/models")
const fs = require('fs')

module.exports = class Engine {
  constructor(sockets) {
    this.sockets = sockets

    try {
      const savedMinis = require('./Mini.json')
      // attach prototype methods + sockets to saved minis
      this.minis = Object.keys(savedMinis).reduce( (minis, uuid) => {
        const mini = savedMinis[uuid]
        const updatedInstance = new MiniInstance(mini, sockets)
        minis[uuid] = updatedInstance
        return minis
      }, {})
    } catch (e) {
      this.minis = {}
    }
  }

  saveMinis() {
    // avoid 'circular structure' JSON.stringify error by removing sockets
    const jsonSafeData = Object.keys(this.minis).reduce( (data, miniUuid) => {
      const jsonSafeMini = Object.keys(this.minis[miniUuid]).reduce( (mini, key) => {
        if (key !== 'sockets') 
          mini[key] = this.minis[miniUuid][key]
        return mini
      }, {})
      data[miniUuid] = jsonSafeMini
      return data
    }, {})

    fs.writeFile("./server/engines/mini/Mini.json", JSON.stringify(jsonSafeData, undefined, 2), (err) => {
      if (err) {
          console.error(err);
          return;
      };
    });
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

  createMini(mini) {
    try {
      const miniInstance = new MiniInstance(mini, this.sockets)
      this.minis[miniInstance.uuid] = miniInstance
      this.saveMinis()
      return miniInstance.clientData
    } catch(e) {
      console.error(e)
      return false
    }
  }

  async joinMini(userId, miniUuid, deckId) {
    const mini = this.minis[miniUuid]
    const participants = Object.keys(mini.users)
    const alreadyInMini = participants.includes(`${userId}`)
    const miniFull = participants.length >= mini.clientData.maxPlayers
    const canJoinMini = !alreadyInMini && !miniFull

    if (canJoinMini) {
      try {
        const format = mini.clientData.format
        const response = await Deck.check({userId, deckId, format})
        if (response) {
          const {dataValues: user} = await User.findById(userId)
          this.minis[miniUuid].users[userId] = {
            cockatriceName: user.cockatriceName,
            ELO: user.ELO,
            deckhash: response.hash,
            decklist: response.list,
            deckId: deckId,
            id: userId,
            uuid: uuidv4()
          }
          this.minis[miniUuid].buildClientData()
          this.saveMinis()
        }
      } catch (e) {
        console.error(e)
      }
    } else {
      console.error(`user ${userId} already in mini ${miniUuid}`)
    }
  }

  leaveMini(userId, miniUuid) {
    const mini = this.minis[miniUuid]
    if (mini) {
      const {[userId]: user, ...otherUsers} = mini.users
      if (user) 
        this.minis[miniUuid].users = otherUsers
        this.minis[miniUuid].buildClientData()
        this.saveMinis()
    }
  }

  async startMini(userId, uuid) {
    // will probably add some userId checks later on
    try {
      if (this.minis[uuid].clientData.state === 'open') {
        this.minis[uuid].clientData.state = 'active'
        this.minis[uuid].clientData.round = 1
        const mini = this.minis[uuid].clientData
        const options = {
          state: mini.state,
          format: mini.format,
          type: mini.type,
          timePerRoundMins: mini.timePerRoundMins,
          maxPlayers: mini.maxPlayers,
          round: mini.round,
          userId: this.minis[uuid].judgeId
        }
        const dbMini = await Mini.create(options)
        const miniId = dbMini.dataValues.id
        this.minis[uuid].id = miniId
        const userMinis = Object.keys(this.minis[uuid].users).map(userId => {
          const user = this.minis[uuid].users[userId]
          return UserMini.create({
            decklist: user.decklist,
            deckhash: user.deckhash,
            ELO: user.ELO,
            cockatriceName: user.cockatriceName,
            userId, miniId, uuid
          })
        })
        Promise.all(userMinis)
        this.minis[uuid].pair()
        this.saveMinis()
      } else if (this.minis[uuid].clientData.state === 'active') {
        throw new Error(`mini ${uuid} already active`)
      }
    } catch (e) {
      console.error(e)
    }
  }
  
  async closeMini(userId, uuid) {
    const removeMini = () => {
      const { [uuid]: closed, ...activeMinis} = this.minis
      this.minis = activeMinis
      this.sockets.emit('remove-mini', uuid)
      this.saveMinis()
    }

    switch (this.minis[uuid].clientData.state) {
      
      case 'open':
        removeMini()
        break;
        
      case 'mini-over':
      try {
        await Mini.update(
          {
            state: 'closed',
            winner: this.minis[uuid].winner
          },
          {where: {id: this.minis[uuid].id}}
        )
        removeMini()
        } catch (e) {
          console.error(e)
        }
        break;
      
      default:
        console.error(`mini ${uuid} was not found or has no state`)
        return false
        break;
    }
    return true
  }
  
  async nextRound(userId, uuid) {
    // will probably add some userId checks later on
    try {
      if (this.minis[uuid].clientData.state === 'round-over') {
        await this.minis[uuid].nextRound()
        this.saveMinis()
      } else if (this.minis[uuid].clientData.state === 'active') {
        throw new Error(`not all matches reported for mini ${uuid}`)
      } else if (this.minis[uuid].clientData.state === 'open') {
        throw new Error(`mini ${uuid} has not started yet`)
      }
    } catch (e) {
      console.error(e)
    }
    this.saveMinis()
  }

  removeResult(userId, miniUuid, matchUuid) {
    this.minis[miniUuid].removeResult(userId, matchUuid)
    this.saveMinis()
  }

  denyResult(userId, miniUuid, matchUuid) {
    this.minis[miniUuid].denyResult(userId, matchUuid)
    this.saveMinis()
  } 

  lockResult(userId, miniUuid, matchUuid) {
    console.log(matchUuid)
    this.minis[miniUuid].results[matchUuid] = {
      uuid: matchUuid,
      locked: true
    }
    this.minis[miniUuid].buildClientData()
    this.saveMinis()
  }

  judgeResult(miniUuid, matchUuid, uuid1, uuid2, score1, score2) {
    this.minis[miniUuid].judgeResult(matchUuid, uuid1, uuid2, score1, score2)
    this.saveMinis()
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
            this.saveMinis()
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
