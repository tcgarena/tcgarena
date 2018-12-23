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
  } catch (e) { next(e) }
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
  } catch (e) { next(e) }
})

// /api/decks PUT
router.put('/', requireLogin, async (req, res, next) => {
  try {
    const {
      decklist: list, 
      deckName: name, 
      deckId
    } = req.body
    const {dataValues: updatedDeck} = await Deck.edit(deckId, req.user.id, {list, name})
    res.status(200).json(updatedDeck)
  } catch (e) { 
    res.sendStatus(403)
   }
})

// /api/decks/:id DELETE
router.delete('/:id', requireLogin, async (req, res, next) => {
  try {
    const deckId = req.params.id
    await Deck.delete(deckId, req.user.id)
    res.sendStatus(200)
  } catch(e) {
    res.sendStatus(403)
   }
})

module.exports = router

