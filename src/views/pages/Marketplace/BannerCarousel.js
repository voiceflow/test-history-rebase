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
			mIndex: 0
		}
	}

	render(){
		return (
			<div className="row">
				<div className="col-sm">
					<Button onClick={()=>{this.setState({mIndex: mod(this.state.mIndex - 1, this.props.modules.length)})}}>
						<i class="fas fa-angle-left"></i>
					</Button>
				</div>

				<Jumbotron fluid>
					<Container fluid>
						<h1 className="display-3">
							{this.state.mIndex}
						</h1>
					</Container>
				</Jumbotron>

				<div className="col-sm">
					<Button onClick={()=>{this.setState({mIndex: mod(this.state.mIndex + 1, this.props.modules.length)})}}>
						<i class="fas fa-angle-right"></i>
					</Button>
				</div>
			</div>
		)
	}


}

export default BannerCarousel;