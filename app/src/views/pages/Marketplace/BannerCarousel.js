import React, { Component } from 'react';
import { Button, Jumbotron, Container } from 'reactstrap';
import './Marketplace.css';

function mod(n, m) {
	return ((n % m) + m) % m;
}

class BannerCarousel extends Component{
	constructor(props){
		super(props);

		this.state = {
			mIndex: 0,
			featured_modules: []
		}
	}

	componentWillReceiveProps(next_props){
		if(this.props !== next_props){
			this.setState({
				featured_modules: next_props.featured_modules
			});
		}
	}

	render(){
		var JumbotronStyle = {};
		if(this.state.featured_modules.length > 0){
			JumbotronStyle = {
				backgroundImage: 'url(' + this.state.featured_modules[this.state.mIndex].banner_img + ')',
				backgroundSize: 'cover'
			}
		}
		console.log(this.state)

		return (
			<div className="row">
				<div className="col-sm">
					<Button onClick={()=>{this.setState({mIndex: mod(this.state.mIndex - 1, this.state.featured_modules.length)})}}>
						<i className="fas fa-angle-left"></i>
					</Button>
				</div>

				<Jumbotron fluid style={JumbotronStyle}>
					<Container fluid>
						<h1 className="display-3">
							fdus9ifjdosaj
						</h1>
					</Container>
				</Jumbotron>

				<div className="col-sm">
					<Button onClick={()=>{this.setState({mIndex: mod(this.state.mIndex + 1, this.state.featured_modules.length)})}}>
						<i className="fas fa-angle-right"></i>
					</Button>
				</div>
			</div>
		)
	}


}

export default BannerCarousel;