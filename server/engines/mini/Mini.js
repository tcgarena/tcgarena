const {Mini, Match} = require("../../db/models")
const uuidv4 = require('uuid/v4');
var generate = require("../../../shared/adjective-adjective-cardname/lib");

class MiniInstance {
  constructor(mini, sockets) {

    this.sockets = sockets
    this.pairings = {}
    this.results = {}
    this.users = {}
    this.uuid = uuidv4()
    this.participantsHash = 0
    this.pairingsHash = 0
    this.resultsHash = 0

    this.clientData = {
      uuid: this.uuid,
      format: mini.format,
      type: mini.type,
      state: 'open',
      timePerRoundMins: mini.timePerRoundMins,
      round: 0,
      createdAt: Date.now(),
      maxPlayers: mini.maxPlayers,
      judge: mini.judgeName
    }

    Object.keys(mini).forEach(key => this[key] = mini[key])

    this.buildClientData(false)
    this.sockets.emit('fetch-mini', this.uuid)
  }
}

MiniInstance.prototype.buildClientData = function (emit=true) {
  const update = {}
  
  let participantsHash = 0
  if (this.users) {
    this.clientData.participants = Object.keys(this.users).reduce( (obj, user) => {
      const {cockatriceName, deckhash, ELO, uuid, inactive} = this.users[user]
      obj[uuid] = {cockatriceName, deckhash, ELO, uuid, inactive}
      participantsHash += cockatriceName.charCodeAt(0) + deckhash.charCodeAt(0) + deckhash.charCodeAt(1) + ELO + (inactive?101:41)
      return obj
    }, {})
  }

  if (participantsHash !== this.participantsHash) {
    this.participantsHash = participantsHash
    update.participants = this.clientData.participants
  }

  let pairingsHash = 0
  if (this.pairings) {
    this.clientData.pairings = Object.keys(this.pairings).reduce( (obj, pairing) => {
      const clientPair = this.pairings[pairing].pair.map( ({
        cockatriceName, ELO, deckhash, uuid
      }) => {
        pairingsHash += cockatriceName.charCodeAt(0) + deckhash.charCodeAt(0) + ELO + uuid.charCodeAt(0)
        return {
          cockatriceName, ELO, deckhash, uuid
        }
      })
      obj[pairing] = {...clientPair, uuid: pairing}
      pairingsHash += pairing.charCodeAt(0)
      return obj
    }, {})
  }
  if (pairingsHash !== this.pairingsHash) {
    this.pairingsHash = pairingsHash
    update.pairings = this.clientData.pairings
  }

  let resultsHash = 0
  if (this.results) {
    this.clientData.results = Object.keys(this.results).reduce( (obj, matchUuid) => {
      const {reportedBy: userId, ...data} = this.results[matchUuid]
      if (userId!==undefined) {
        obj[matchUuid] = {...data, reportedBy: this.users[userId].cockatriceName}
      } else {
        obj[matchUuid] = {...data}
      }
      return obj
    }, {})
    update.results = this.clientData.results
  }

  if (emit) {
    this.sockets.emit('update-mini', this.uuid, update)
  }
}

// unchanged

MiniInstance.prototype.checkRoundOver = function () {
  const isRoundOver = Object.keys(this.results).length === Object.keys(this.pairings).length
    && Object.keys(this.results).reduce( (bool, key) => {
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
      this.clientData.winner = activePlayers[0]
      this.clientData.state = 'mini-over'
      this.buildClientData()
      this.sockets.emit('update-mini', this.uuid, {
        state: this.clientData.state,
        winner: this.clientData.winner
      })
      Mini.update({
        winner: this.clientData.winner.cockatriceName
      },{
        where: {id: this.id}
      })
    } else {
      this.clientData.state = 'round-over'
      this.sockets.emit('update-mini', this.uuid, {
        state: this.clientData.state
      })
    }

  }
}

MiniInstance.prototype.findUserIdByUuid = function(uuid) {
  return Object.keys(this.users).reduce( (userId, key) => {
    if (this.users[key].uuid === uuid) {
      return this.users[key].id
    } else {
      return userId
    }
  }, null)
}

MiniInstance.prototype.judgeResult = async function(matchUuid, uuid1, uuid2, score1, score2) {
  const user1Id = this.findUserIdByUuid(uuid1)
  const user2Id = this.findUserIdByUuid(uuid2)
  this.results[matchUuid] = {
    reportedBy: user1Id,
    confirmedBy: user2Id,
    score1, score2,
    uuid: matchUuid,
    finalized: true,
  }
  const response = await Match.result(matchUuid, user1Id, score1, score2)
  this.users[user1Id].ELO = response[user1Id]
  this.users[user2Id].ELO = response[user2Id]
  // save the winning users somewhere so we know who to pair for the next round
  // sloppy check for winner
  if (score1 > score2) {
    // confirmedBy lost
    this.users[user2Id].inactive = true
  } else if (score1 < score2) {
    // reportedBy lost
    this.users[user1Id].inactive = true
  } else {
    // players tied
  }
  this.buildClientData()
  this.sockets.emit('update-users', [user1Id, user2Id])
  this.checkRoundOver()
}

MiniInstance.prototype.denyResult = function(userId, matchUuid) {
  let myMatch = false
  for (let i=0; i<2; i++)
    myMatch = this.pairings[matchUuid].pair[i].id === userId
      ? true : myMatch
  if (myMatch) {
    this.results[matchUuid].locked = true
    this.buildClientData()
  } else {
    // log malicious attempt
  }
}

MiniInstance.prototype.removeResult = function(userId, matchUuid) {
  let myMatch = false
  for (let i=0; i<2; i++)
    myMatch = this.pairings[matchUuid].pair[i].id === userId
      ? true : myMatch
  if (myMatch) {
    this.results = Object.keys(this.results).reduce( (results, key) => {
      if (this.results[key].uuid !== matchUuid)
        results[key] = this.results[key]
      return results
    }, {})
    this.buildClientData()
  } else {
    // log malicious attempt
  }
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
          const reportedBy = this.results[matchUuid].reportedBy
          this.users[userId].ELO = response[userId]
          this.users[reportedBy].ELO = response[reportedBy]
          this.results[matchUuid].finalized = true
          this.results[matchUuid].confirmedBy = userId
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
          this.checkRoundOver()
          this.sockets.emit('update-users', [result.confirmedBy, result.reportedBy])
          return response

        } catch (e) {
          console.error(e)
          return {message: 'something went wrong'}
        }
      }
    } else {
      console.log(userId, score1, score2)
      this.results[matchUuid] = {
        reportedBy: userId,
        score1, score2,
        uuid: matchUuid,
        finalized: false
      }
      this.buildClientData()
      return {message: 'score reported'}
    }
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
    state: 'active',
    round: this.clientData.round
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

MiniInstance.prototype.nextRound = async function () {
  try {
    this.clientData.state = 'active'
    this.clientData.round++
    try {
      await Mini.update(
        {round: this.clientData.round},
        {where: {id: this.id}}
      )
    } catch(e) {
      console.error(e)
      return false
    }
    this.pair()
    return true
  } catch (e) {
    console.error(e)
  }
}


module.exports = MiniInstance
