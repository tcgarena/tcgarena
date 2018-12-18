const router = require('express').Router()
const {Deck} = require('../db/models')
const {requireLogin} = require('../middlewares')

// /api/decks GET
router.get('/', requireLogin, async (req, res, next) => {
  try {
    const decks = await Deck.findAll({
      where: {userId: req.user.id}
    })
    res.json(decks)
  } catch (e) {
    next(e)
  }
})

// /api/decks POST
router.post('/', requireLogin, async (req, res, next) => {
  try {
    const {format, decklist, deckName} = req.body
    const deck = await Deck.create({
      format,
      list: decklist,
      name: deckName,
      userId: req.user.id
    })
    res.status(200).json(deck)
  } catch (e) {
    next(e)
  }
})

// /api/decks PUT
router.put('/', requireLogin, async (req, res, next) => {
  try {
    // console.log('req.body', req.body.id)
    const {format, decklist, deckName} = req.body
    const [numRows, updatedRow] = await Deck.update(
      {
        format,
        list: decklist,
        name: deckName,
      },
      {
        where: {
          id: req.body.id
        },
        returning: true
      }
    )
    res.status(200).json(updatedRow[0])
  } catch (e) {
    next(e)
  }
})

module.exports = router
