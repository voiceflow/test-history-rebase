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
			<div className="card-container"
				 onMouseEnter={() => {this.setState({hovered: true})}} 
				 onMouseLeave={() => {this.setState({hovered: false})}}
			>
				<Card
					style={{ backgroundColor: '#333', borderColor: '#333' }} 
					onMouseEnter={() => {this.setState({hovered: true})}} 
					onMouseLeave={() => {this.setState({hovered: false})}}
					onClick={this.props.onClick}
				>
					<CardImg top src={this.props.module.card_icon} alt="Card image cap" />

					{this.state.hovered?
						<CardImgOverlay className="module-card">
							<CardTitle>{this.props.module.title}</CardTitle>
							<CardSubtitle>{this.props.module.creator_id}</CardSubtitle>
							<hr/>
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