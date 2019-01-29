const {Mini, Match} = require("../../db/models")
const uuidv4 = require('uuid/v4');
var generate = require("../../../shared/adjective-adjective-cardname/lib");

class MiniInstance {
  constructor(dataValues, sockets) {

    const serverValues = [
      'id',
      'createdAt',
      'users',
    ]

    serverValues.forEach(key => this[key] = dataValues[key])

    this.sockets = sockets
    this.pairings = {}
    this.results = {}

    this.clientData = {
      participants: {},
      pairings: {},
      results: {}
    }

    const clientValues = [
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

MiniInstance.prototype.checkRoundOver = function () {
  const isRoundOver = Object.keys(this.results).reduce( (bool, key) => {
    if (!this.results[key].finalized)
      return false
    return bool
  }, true)

  if (isRoundOver) {
    
    const activePlayers = Object.keys(this.users).reduce( (players, key) => {
      if (this.users[key].inactive !== true)
        players.push(this.users[key])
      return players
    }, [])

    if (activePlayers.length === 1) {
      this.pairings = {}
      this.results = {}
      this.winner = activePlayers[0].uuid
      this.clientData.state = 'mini-over'
      this.buildClientData()
      this.sockets.emit('update-mini', this.uuid, {
        state: this.clientData.state,
        winner: this.winner,
        pairings: this.clientData.pairings,
        results: this.clientData.results
      })
    } else {
      this.clientData.state = 'round-over'
      this.sockets.emit('update-mini', this.uuid, {
        state: this.clientData.state
      })
    }

  }
}

MiniInstance.prototype.removeResult = function(userId, matchUuid) {
  this.results = Object.keys(this.results).reduce( (results, key) => {
    if (this.results[key].uuid !== matchUuid)
      results[key] = this.results[key]
    return results
  }, {})
  this.buildClientData()
  this.sockets.emit('update-mini', this.uuid, {
    results: this.clientData.results
  })
}

MiniInstance.prototype.reportResult = async function (userId, matchUuid, score1, score2) {
  if (score1 < 0 || score2 < 0 || score1 > 2 || score2 > 2 || score1 + score2 > 3 || score1 + score2 < 1) {
    return {message: 'score invalid'}
  } else {
    const result = this.results[matchUuid]
    if (result) {
      if (score1 !== result.score2 || score2 !== result.score1) {
        // players reported mismatching score....
        return {message: 'score mismatch'}
      } else {
        try {
          // good to go!
          const response = await Match.result(matchUuid, result.reportedBy, result.score1, result.score2)
          result.finalized = true
          result.confirmedBy = userId
          // save the winning users somewhere so we know who to pair for the next round
          // sloppy check for winner
          if (result.score1 > result.score2) {
            // confirmedBy lost
            this.users[result.confirmedBy].inactive = true
          } else if (result.score1 < result.score2) {
            // reportedBy lost
            this.users[result.reportedBy].inactive = true
          } else {
            // players tied
          }
          this.buildClientData()
          this.sockets.emit('update-mini', this.uuid, {
            results: this.clientData.results,
            participants: this.clientData.participants
          })
          this.checkRoundOver()
          return response

        } catch (e) {
          console.error(e)
          return {message: 'something went wrong'}
        }
      }
    } else {
      this.results[matchUuid] = {
        reportedBy: userId,
        score1, score2,
        uuid: matchUuid,
        finalized: false
      }
      this.buildClientData()
      this.sockets.emit('update-mini', this.uuid, {
        results: this.clientData.results
      })
      return {message: 'score reported'}
    }
  }
}

MiniInstance.prototype.getUuid = async function() {
  this.uuid = uuidv4()
  this.clientData.uuid = this.uuid
}

MiniInstance.prototype.buildClientData = function () {
  if (this.users) {
    this.clientData.participants = Object.keys(this.users).reduce( (obj, user) => {
      const {cockatriceName, deckhash, ELO, uuid, inactive} = this.users[user]
      obj[uuid] = {cockatriceName, deckhash, ELO, inactive}
      return obj
    }, {})
  }

  if (this.pairings) {
    this.clientData.pairings = Object.keys(this.pairings).reduce( (obj, pairing) => {
      const clientPair = this.pairings[pairing].pair.map( ({
        cockatriceName, ELO, deckhash
      }) => ({
        cockatriceName, ELO, deckhash
      }))
      obj[pairing] = {...clientPair, uuid: pairing}
      return obj
    }, {})
  }

  if (this.results) {
    this.clientData.results = Object.keys(this.results).reduce( (obj, matchUuid) => {
      const {reportedBy: userId, ...data} = this.results[matchUuid]
      obj[matchUuid] = {...data, reportedBy: this.users[userId].cockatriceName}
      return obj
    }, {})
  }
}

MiniInstance.prototype.pair = async function () {
  this.results = {}
  const activePlayersByELO = Object.keys(this.users)
    .reduce( (players, key) => {
      if (this.users[key].inactive !== true)
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

  activePlayersByELO.forEach(player => pairPlayer(player))
  this.pairings = this.pairings.reduce( (obj, pair) => {
    const uuid = uuidv4()
    obj[uuid] = {pair, uuid}
    return obj
  }, {})

  this.buildClientData()

  this.sockets.emit('update-mini', this.uuid, {
    pairings: this.clientData.pairings,
    state: 'active',
    round: this.clientData.round,
    results: this.clientData.results
  })

  try {
    const pairs = await Promise.all(
      Object.keys(this.pairings).map( pairing => {
        const {pair} = this.pairings[pairing]
        Match.create({
          uuid: pairing,
          miniId: this.id,
          user1Id: pair[0].id,
          user1decklist: pair[0].decklist,
          user1deckhash: pair[0].deckhash,
          user1ELO: pair[0].ELO,
          user2Id: pair[1].id,
          user2decklist: pair[1].decklist,
          user2deckhash: pair[1].deckhash,
          user2ELO: pair[1].ELO
        })
      }
    ))
  } catch (e) {
    console.error(e)
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

MiniInstance.prototype.nextRound = async function () {
  try {
    await Mini.update(
      {round: this.clientData.round + 1},
      {where: {id: this.id}}
    )
    this.clientData.state = 'active'
    this.clientData.round++
    this.pair()
  } catch (e) {
    console.error(e)
  }
}


module.exports = MiniInstance
