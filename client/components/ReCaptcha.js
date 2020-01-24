import React, {Component} from 'react'
import ReCaptcha from 'react-recaptcha'

class ReCaptchaComponent extends Component {
  constructor(props, context) {
    super(props, context)
    this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this)
    this.verifyCallback = this.verifyCallback.bind(this)
  }
  componentDidMount() {
  }

  onLoadRecaptcha() {
    console.log('reCaptcha loaded')
  }
  verifyCallback(response) {
    if (response) {
      this.props.handleVerify()
    }
  }
  render() {
    return (
      <div id='recaptcha'>
        <ReCaptcha
          size="normal"
          render="explicit"
          sitekey="6LfGG40UAAAAAHmGrHDQAOye_BUbXviXBjUcj-jt"
          onloadCallback={this.onLoadRecaptcha}
          verifyCallback={this.verifyCallback}
        />
      </div>
    )
  }
}
export default ReCaptchaComponent
