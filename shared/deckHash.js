const sha1 = require('js-sha1');
const BigInteger = require('jsbn').BigInteger;

const deckHash = (main, side) => {
  const toHash = [];

  Object.keys(main).forEach(card => {
    for (let i=0; i<main[card].amount; i++) 
      toHash.push(`${card.toLowerCase()}`)
  })

  Object.keys(side).forEach(card => {
    for (let i=0; i<side[card].amount; i++) 
      toHash.push(`SB:${card.toLowerCase()}`)
  })

  const sha = sha1.array( toHash.sort().join(';') );
  let bnShaSum = new BigInteger('0');
  const bnShaArr = [];

  for (let i=0; i<5; i++) 
    bnShaArr.push( new BigInteger( sha[i].toString() ) )
  

  bnShaSum = bnShaSum
    .add( bnShaArr[0].shiftLeft(32) )
    .add( bnShaArr[1].shiftLeft(24) )
    .add( bnShaArr[2].shiftLeft(16) )
    .add( bnShaArr[3].shiftLeft( 8) )
    .add( bnShaArr[4] );

  const hash = bnShaSum.toString(32)

  console.log('hash', hash)
  return hash
}

export default deckHash