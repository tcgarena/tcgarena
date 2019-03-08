'use strict'

const db = require('../server/db')
const {User, Deck, Mini, UserMini} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({userId: 1, email: 'cody@email.com', password: '12345', cockatriceName: 'cody', role: 'user'}),
    User.create({userId: 2, email: 'murphy@email.com', password: '12345', cockatriceName: 'murphy', role: 'user'}),
    User.create({userId: 3, email: 'joe@email.com', password: '12345', cockatriceName: 'joe', role: 'user'}),
    User.create({userId: 4, email: 'ben@email.com', password: 'ben123', cockatriceName: 'morphiac', role: 'admin'})
  ]) 

  const decks = await Promise.all([
    Deck.create({name: 'tron', format:'modern', userId: 1,
      list: `// 60 Maindeck\n// 18 Artifact\n4 Chromatic Sphere\n4 Chromatic Star\n4 Expedition Map\n4 Oblivion Stone\n2 Relic of Progenitus\n\n// 7 Creature\n2 Ulamog, the Ceaseless Hunger\n2 Walking Ballista\n3 Wurmcoil Engine\n\n// 2 Instant\n2 Dismember\n\n// 19 Land\n5 Forest\n1 Ghost Quarter\n1 Sanctum of Ugin\n4 Urza's Mine\n4 Urza's Power Plant\n4 Urza's Tower\n\n// 6 Planeswalker\n4 Karn Liberated\n2 Ugin, the Spirit Dragon\n\n// 8 Sorcery\n4 Ancient Stirrings\n4 Sylvan Scrying\n\n\n// 15 Sideboard\n// 2 Artifact\nSB: 1 Crucible of Worlds\nSB: 1 Grafdigger's Cage\n\n// 6 Creature\nSB: 1 Emrakul, the Promised End\nSB: 3 Thought-Knot Seer\nSB: 2 Thragtusk\n\n// 7 Instant\nSB: 2 Gut Shot\nSB: 3 Nature's Claim\nSB: 2 Surgical Extraction`
    }),
    Deck.create({name: 'tron', format:'modern', userId: 2,
      list: `// 60 Maindeck\n// 18 Artifact\n4 Chromatic Sphere\n4 Chromatic Star\n4 Expedition Map\n4 Oblivion Stone\n2 Relic of Progenitus\n\n// 7 Creature\n2 Ulamog, the Ceaseless Hunger\n2 Walking Ballista\n3 Wurmcoil Engine\n\n// 2 Instant\n2 Dismember\n\n// 19 Land\n5 Forest\n1 Ghost Quarter\n1 Sanctum of Ugin\n4 Urza's Mine\n4 Urza's Power Plant\n4 Urza's Tower\n\n// 6 Planeswalker\n4 Karn Liberated\n2 Ugin, the Spirit Dragon\n\n// 8 Sorcery\n4 Ancient Stirrings\n4 Sylvan Scrying\n\n\n// 15 Sideboard\n// 2 Artifact\nSB: 1 Crucible of Worlds\nSB: 1 Grafdigger's Cage\n\n// 6 Creature\nSB: 1 Emrakul, the Promised End\nSB: 3 Thought-Knot Seer\nSB: 2 Thragtusk\n\n// 7 Instant\nSB: 2 Gut Shot\nSB: 3 Nature's Claim\nSB: 2 Surgical Extraction`
    }),
    Deck.create({name: 'tron', format:'modern', userId: 3,
      list: `// 60 Maindeck\n// 18 Artifact\n4 Chromatic Sphere\n4 Chromatic Star\n4 Expedition Map\n4 Oblivion Stone\n2 Relic of Progenitus\n\n// 7 Creature\n2 Ulamog, the Ceaseless Hunger\n2 Walking Ballista\n3 Wurmcoil Engine\n\n// 2 Instant\n2 Dismember\n\n// 19 Land\n5 Forest\n1 Ghost Quarter\n1 Sanctum of Ugin\n4 Urza's Mine\n4 Urza's Power Plant\n4 Urza's Tower\n\n// 6 Planeswalker\n4 Karn Liberated\n2 Ugin, the Spirit Dragon\n\n// 8 Sorcery\n4 Ancient Stirrings\n4 Sylvan Scrying\n\n\n// 15 Sideboard\n// 2 Artifact\nSB: 1 Crucible of Worlds\nSB: 1 Grafdigger's Cage\n\n// 6 Creature\nSB: 1 Emrakul, the Promised End\nSB: 3 Thought-Knot Seer\nSB: 2 Thragtusk\n\n// 7 Instant\nSB: 2 Gut Shot\nSB: 3 Nature's Claim\nSB: 2 Surgical Extraction`
    }),
    Deck.create({name: 'tron', format:'modern', userId: 4,
      list: `// 60 Maindeck\n// 18 Artifact\n4 Chromatic Sphere\n4 Chromatic Star\n4 Expedition Map\n4 Oblivion Stone\n2 Relic of Progenitus\n\n// 7 Creature\n2 Ulamog, the Ceaseless Hunger\n2 Walking Ballista\n3 Wurmcoil Engine\n\n// 2 Instant\n2 Dismember\n\n// 19 Land\n5 Forest\n1 Ghost Quarter\n1 Sanctum of Ugin\n4 Urza's Mine\n4 Urza's Power Plant\n4 Urza's Tower\n\n// 6 Planeswalker\n4 Karn Liberated\n2 Ugin, the Spirit Dragon\n\n// 8 Sorcery\n4 Ancient Stirrings\n4 Sylvan Scrying\n\n\n// 15 Sideboard\n// 2 Artifact\nSB: 1 Crucible of Worlds\nSB: 1 Grafdigger's Cage\n\n// 6 Creature\nSB: 1 Emrakul, the Promised End\nSB: 3 Thought-Knot Seer\nSB: 2 Thragtusk\n\n// 7 Instant\nSB: 2 Gut Shot\nSB: 3 Nature's Claim\nSB: 2 Surgical Extraction`
    })
  ])

  console.log(`seeded ${users.length} users`)
  console.log(`seeded ${decks.length} decks`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed