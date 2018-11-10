import React, { Component } from 'react';
import { Card, CardImg, CardText, CardImgOverlay, CardTitle, CardSubtitle } from 'reactstrap';
import './Marketplace.css';

class Module extends Component{
	constructor(props){
		super(props);

		this.state = {
			hovered: false
		}

		this.handleModuleView = this.handleModuleView.bind(this);
	}

	handleModuleView() {
		this.props.history.push('/marketplace/' + this.props.module.module_id);
	}

	render(){
		return (
			<div className="card-container">
				<Card
					style={{ backgroundColor: '#333', borderColor: '#333' }} 
					onMouseEnter={() => {this.setState({hovered: true})}} 
					onMouseLeave={() => {this.setState({hovered: false})}}
					onClick={this.props.onClick}
				>
					<CardImg top src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" alt="Card image cap" />

					{this.state.hovered?
						<CardImgOverlay>
							<CardTitle>{this.props.module.title}</CardTitle>
							<CardSubtitle>{this.props.module.creator_id}</CardSubtitle>
							<CardText>{this.props.module.descr}</CardText>
						</CardImgOverlay>
						:
						undefined
					}
				</Card>
			</div>
		)
	}


}

export default Module;