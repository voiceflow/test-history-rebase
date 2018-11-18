import React, { Component } from 'react';
import { Card, CardImg, CardText, CardTitle, CardSubtitle, CardBody, Button } from 'reactstrap';
import './Marketplace.css';

class Module extends Component{
	constructor(props){
		super(props);

		this.state = {
			hover: false
		}

		this.handleModuleView = this.handleModuleView.bind(this);
		this.handleAddRemove = this.handleAddRemove.bind(this);
	}

	handleModuleView() {
		this.props.history.push('/marketplace/' + this.props.module.module_id);
	}

	handleAddRemove() {
		console.log("MIMI")
	}

	render(){
		console.log(this.props)
		return (
			<div className="card-container">
				<Card 
					onClick={this.props.onClick}
					onMouseEnter={() => {this.setState({hover:true})}}
					onMouseLeave={() => {this.setState({hover:false})}}
				>
					{
						this.props.owned?
						<i className="far fa-check-circle mt-2 ml-2"></i>
						:
						<i className="far fa-circle mt-2 ml-2"></i>
					}
					<CardBody className="text-center pb-0">
						<img src={this.props.module.card_icon} className="card-icon border rounded mb-1"/>
						<h5>{this.props.module.title}</h5>
						<p>{this.props.module.descr}</p>
						<hr className="mb-0"/>
						<p className="mb-0 mt-0 pt-0">Created by {this.props.module.name}</p>
						{
							this.state.hover
							?
								<Button className="mb-2" onClick={this.handleAddRemove}>{this.props.owned? "Remove" : "Add"}</Button>
							:
							null
						}
					</CardBody>
				</Card>
			</div>
		)
	}


}

export default Module;