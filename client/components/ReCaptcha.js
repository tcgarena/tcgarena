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
    // Here you will get the final recaptchaToken!!!
    if (response) {
      console.log(response, '<= your recaptcha token')
      this.props.handleVerify()
    }
  }
  render() {
    return (
      <div>
        {/* You can replace captchaDemo with any ref word */}
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
