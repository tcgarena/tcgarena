const {Mini, Match} = require("../../db/models")

class MiniInstance {
  constructor(dataValues, sockets) {

    const serverValues = [
      'id', 
      'createdAt', 
      'users',
    ]

    serverValues.forEach(key => this[key] = dataValues[key] )

    this.sockets = sockets
    this.pairings = []
    
    this.clientData = {
      participants: {},
      pairings: []
    }
    
    const clientValues = [
      'id',
      'state', 
      'format',
      'type',
      'timePerRoundMins',
      'maxPlayers',
      'round'
    ]

    clientValues.forEach(key => this.clientData[key] = dataValues[key] )
    this.buildClientData()
  }
}

MiniInstance.prototype.buildClientData = function () {
  
  this.clientData.participants = Object.keys(this.users).reduce( (obj, key) => {
    const {id: _, ...userData} = this.users[key]
    obj[userData.cockatriceName] = userData
    return obj
  }, {})

  this.clientData.pairings = this.pairings.map(
    pair => pair.map( ({
      cockatriceName, ELO, deckhash
    }) => ({
      cockatriceName, ELO, deckhash
    })
  ))
}

MiniInstance.prototype.pair = async function () {
  const playersByELO = Object.keys(this.users)
    .reduce( (players, key) => {
      players.push(this.users[key])
      return players
    }, [])
    .sort( (prev, curr) => prev.ELO > curr.ELO ? -1 : 1 )

  this.pairings = []
  const pairPlayer = player => {
    const lastPairIdx = this.pairings.length-1
    if (!this.pairings[lastPairIdx]) {
      this.pairings.push([player])
    } else if (this.pairings[lastPairIdx].length === 2) {
      this.pairings.push([player])
    } else if (this.pairings[lastPairIdx].length === 1) {
      this.pairings[lastPairIdx].push(player)
    }
  }

  playersByELO.forEach(player => pairPlayer(player))

  this.buildClientData()

  this.sockets.emit('update-mini', this.id, {
    pairings: this.clientData.pairings
  })

  try {
    const pairs = await Promise.all(this.pairings.map(pair => {
      Match.create({
        miniId: this.id,
        userId1: pair[0].id,
        user1decklist: pair[0].decklist,
        user1deckhash: pair[0].deckhash,
        user1ELO: pair[0].ELO,
        userId2: pair[1].id,
        user2decklist: pair[1].decklist,
        user2deckhash: pair[1].deckhash,
        user2ELO: pair[1].ELO
      })
    }))
  } catch (e) {
    console.error(e)
  }
}

MiniInstance.prototype.refresh = async function () {
  try {
    const mini = await Mini.fetchById(this.id)
    Object.keys(mini).forEach( key => this[key] = mini[key] )
  } catch (e) {
    console.error()
  }
}

MiniInstance.prototype.start = async function () {
  try {
    await Mini.update(
      {
        state: 'active',
        round: 1
      },
      {where: {id: this.id}}
    )
    this.clientData.state = 'active'
    this.clientData.round = 1
    this.pair()
  } catch (e) {
    console.error(e)
  }
}

module.exports = MiniInstance