import React, {Component} from 'react'

import AuthenticationService from './../../../services/Authentication'

class Button extends Component{

    constructor(props) {
        super(props);

        this.triggerLogin = this.triggerLogin.bind(this);
    }

	componentWillMount(){
		AuthenticationService.amazon_load();
	}

	triggerLogin(){
		let that = this;
		that.props.updateLogin(1);
		AuthenticationService.amazon_login().then(
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