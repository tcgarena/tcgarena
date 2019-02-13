const fs = require('fs')
const request = require('request')
const historic = require('./historic.json')

request('https://mtgjson.com/json/AllCards.json', async (err, response, body) => {
  if (err) {
    console.log(err)
  } else {
    const mtgjson = JSON.parse(body)
    const cardData = Object.keys(mtgjson).reduce( (data, card) => {
      if (Object.keys(mtgjson[card].legalities).length) {
        const standards = []
  
        mtgjson[card].printings.forEach(printing => {
          Object.keys(historic.standards).forEach(standard => {
            if (historic.standards[standard].includes(printing) && !standards.includes(standard))
              standards.push(standard)
          })
        })
  
        if (mtgjson[card].legalities['future'] === 'Legal') {
          data[card] = {
            legalities: {
              ...mtgjson[card].legalities,
              standard: 'Legal',
              modern: 'Legal',
              vintage: 'Legal',
              legacy: 'Legal'
            },
            standards
          }
        } else {
          data[card] = {
            legalities: mtgjson[card].legalities,
            standards
          }
        }
      }
      return data
    }, {})
    fs.writeFile("./server/api/data/cardData.json", JSON.stringify(cardData, undefined, 2), (err) => {
      if (err) {
          console.error(err);
          return;
      };
    });
  }
});
