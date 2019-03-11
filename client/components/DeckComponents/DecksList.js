import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {DeckPreview, DeckItem} from '../index';

class DecksList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      previewId: null
    }
    this.setPreview = this.setPreview.bind(this)
  }

  setPreview(previewId) {
    this.setState({previewId})
  }

  render() {
    const {decks, selectedFormat, history, actionButton} = this.props
    const {previewId} = this.state
    const decksArr = Object.keys(decks)
      // reduce = keyed obj => array filtered by selected format
      .reduce((arr, key) => {
        if (decks[key].format === selectedFormat) arr.push(decks[key])
        return arr
      }, [])
    return (
      <div className='row'>
        <div className="decks-list">
          {decksArr.map(deck => (
            <div key={deck.id}>
              <DeckItem
                actionButton={actionButton}
                history={history}
                deck={deck}
                preview={this.setPreview}
              />
            </div>
          ))}
        </div>

        <div style={{marginLeft: 167}}>
          <DeckPreview deckId={previewId}/>
        </div>
      </div>
    )
  }
}

const mapState = ({decks, user: {selectedFormat}}) => ({
  decks,
  selectedFormat
})

export default withRouter(connect(mapState)(DecksList))
