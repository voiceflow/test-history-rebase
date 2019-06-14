import React, {Component} from 'react'
import axios from 'axios'

const AmazonLoad = () => new Promise((resolve) => {
  // @TODO: handle errors
  if (document.getElementById('amazon-sdk')) {
    return resolve()
  }

  const firstJS = document.getElementsByTagName('script')[ 0 ]
  const js = document.createElement('script')

  js.src = '//api-cdn.amazon.com/sdk/login1.js'
  js.id = 'amazon-sdk'
  js.async = true

  const appId = "amzn1.application-oa2-client.582f261a95e1447894d13a4fe2a1c72e";
  window.onAmazonLoginReady = () => {
    window.amazon.Login.setClientId(appId)

    return resolve()
  }
  if (!firstJS) {
    document.head.appendChild(js)
  } else {
    firstJS.parentNode.appendChild(js)
  }
})

const AmazonLogin = () => new Promise((resolve, reject) => {
  const options={response_type:"code", scope:"alexa::ask:skills:readwrite alexa::ask:models:readwrite alexa::ask:skills:test profile"}
  window.amazon.Login.authorize(options, (response) => {
    if (response.error) {
        reject()
    }else{
      axios.get('/session/amazon/' + response.code)
      .then(res => {
        resolve();
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
    }
  })
})

class Button extends Component{

    constructor(props) {
        super(props);

        this.triggerLogin = this.triggerLogin.bind(this);
    }

	componentWillMount(){
		AmazonLoad()
	}

	triggerLogin(){
		let that = this;
		that.props.updateLogin(1);
		AmazonLogin().then(
			() => that.props.updateLogin(2)
		).catch(() => that.props.updateLogin(-1))
	}

	render(){
		const width = this.props.small ? "234" : "312"
		const height = this.props.small ? "48" : "64"
	  	return(
	  		<div className="LoginWithAmazon" onClick={this.triggerLogin}>
          <img border="0" alt="Login with Amazon" className="unpressed"
              src="https://images-na.ssl-images-amazon.com/images/G/01/lwa/btnLWA_gold_312x64.png"
              width={width} height={height} />
          <img border="0" alt="Login with Amazon" className="pressed"
              src="https://images-na.ssl-images-amazon.com/images/G/01/lwa/btnLWA_gold_312x64_pressed.png"
              width={width} height={height} />
			</div>
		)
	}
}

export default Button
