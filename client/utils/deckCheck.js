import axios from 'axios'

const deckCheck = async (format, decklist, deckName) => {
  const {data: cardData } = await axios.get('/api/data/cards')
  const {data: historic} = format === 'historic' ? await axios.get('/api/data/historic') : {data: undefined}
  let cards = {}
  let main = {}
  let side = {}
  let size = 0
  let errors = []
  let isLegal = false

  if (deckName==='') errors.push("Deck has no name.")

  const CYCHMTFO = [ //cardsYouCanHaveMoreThanFourOf
    'Island',
    'Plains',
    'Swamp',
    'Forest',
    'Mountain',
    'Wastes',
    'Rat Colony',
    'Relentless Rats',
    'Shadowborn Apostle'
  ];

  const cardsToIgnore = [
    'Island',
    'Plains',
    'Swamp',
    'Forest',
    'Mountain',
    'Wastes'
  ];

  const addCard = (card, amount, addToMain=true) => {
    cards.hasOwnProperty(card)
      ? cards[card].amount += 1
      : cards[card] = { amount }

    addToMain
      ? main.hasOwnProperty(card)
        ? main[card].amount += 1
        : main[card] = { amount }
      : side.hasOwnProperty(card)
        ? side[card].amount += 1
        : side[card] = { amount }
  }

  let regexData
  decklist
    .split('\n')
    .forEach( (line, idx) => {
      if(line !== '' && line.indexOf('//') === -1) {
        try {
          // used to seperate amount from name
          regexData = line.match(/[0-9]+/)

          // throws an error when card amount is improperly formatted
          let name = line.slice(regexData[0].length+regexData.index+1)
          let amount = parseInt(regexData[0])


          cardsToIgnore.includes(name) || cardData[name]
            ? addCard( name, amount, line.indexOf('SB') === -1 )
            : errors.push(`${name} is not a card.`)

        } catch(e) {
          errors.push(`Line ${idx+1}: '${line}' is invalid`)
        }
      }
    })

  if (format === 'historic' || format === 'pauper') {
    window.alert(`${format} not yet supported`)
  }

  // do checks for all other formats
  else {
    for (let card in cards) {
      if (cards.hasOwnProperty(card)) {

        if (cardsToIgnore.indexOf(card) === -1) {

          // check if card is legal in format
          if (cardData[card].legalities[format] !== 'legal') {

            // not legal? maybe is restricted...
            if (cardData[card].legalities[format] === 'restricted' && format === 'vintage') {

              // its restricted, but are we playing just one copy?
              if (cards[card].amount > 1) {
                errors.push( `${card} is restricted.` );
              }
            }

            // okay, its not legal nor restricted
            else {
              errors.push( `${card} is not legal in ${format}.` );
            }
          }
        }

        size += cards[card].amount;
      }
    }
  }

  // make sure there is valid amounts per card
  for (let card in cards) {
    if (cards.hasOwnProperty(card)) {
      if (cards[card].amount > 4 && CYCHMTFO.indexOf(card) === -1) {
        errors.push( `Deck has more than 4 ${card}.` );
      }
    }
  }

  // decksize checks
  if (format === 'commander') {
    if (size < 99) errors.push( `Deck has less than 100 cards.` );
    if (size > 100) errors.push( `Deck has more than 100 cards.` );
  } else {
    const maindeckSize = Object.keys(main).reduce( (prev, curr) => prev + main[curr].amount, 0)
    const sideboardSize = Object.keys(side).reduce( (prev, curr) => {
      // looks like `wear // tear ` isn't getting picked up as a card, probably true for other split cards
      // console.log(side[curr])
      return prev + side[curr].amount
    }, 0)
    if (maindeckSize < 60) errors.push( `Maindeck has less than 60 cards.` )
    if (sideboardSize > 15) errors.push( `Sideboard has more than 15 cards.` )
  }

  // if no errors were found, the deck must be legal
  if (errors.length === 0) isLegal = true

  return (
    { cards, main, side, size, errors, isLegal, format }
  )
}

export default deckCheck
