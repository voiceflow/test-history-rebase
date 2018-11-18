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
			featured_modules: [
				{ title: '',
				  descr:''},
				{ title: '',
				  descr:''}
			]
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
		var currentModule1 = 
			<div>
				<img src={this.state.featured_modules[0].card_icon} className="card-icon border rounded mb-1"/>
				<h1>{this.state.featured_modules[0].title}</h1>
				<p>{this.state.featured_modules[0].descr}</p>
			</div>

		var currentModule2 = 
			<div>
				<img src={this.state.featured_modules[1].card_icon} className="card-icon border rounded mb-1"/>
				<h1>{this.state.featured_modules[1].title}</h1>
				<p>{this.state.featured_modules[1].descr}</p>
			</div>

		return (
			<div className="container">
				<div className="row">
					<h1>Featured Flows</h1>
				</div>
				<div className="row">

					<Jumbotron>
						<Container>
							{currentModule1}
						</Container>
					</Jumbotron>

					<Jumbotron>
						<Container>
							{currentModule2}
						</Container>
					</Jumbotron>
				</div>
			</div>
		)
	}


}

export default BannerCarousel;