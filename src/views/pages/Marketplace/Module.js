import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';
import './Marketplace.css';

class Module extends Component{
	constructor(props){
		super(props);
	}

	render(){
		return (
			<div className="card-container">
				<Card>
					<CardImg top src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" alt="Card image cap" />
					<CardBody>
						<CardTitle>{this.props.module.title}</CardTitle>
						<CardSubtitle>{this.props.module.creator_id}</CardSubtitle>
						<CardText>{this.props.module.descr}</CardText>
						<Button>Button</Button>
					</CardBody>
				</Card>
			</div>
		)
	}


}

export default Module;