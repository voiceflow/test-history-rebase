import React, { Component } from 'react';
import { Card, CardImg, CardText, CardTitle, CardSubtitle, CardBody, Button } from 'reactstrap';
import './Marketplace.css';
import axios from 'axios';

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
		if(!this.props.ownership.has(this.props.module.module_id)){
			axios.post(`/marketplace/user_module/${this.props.module.module_id}`)
			.then(res => {
				if(res.status === 200){
					let ownership = this.props.ownership;
					ownership.add(this.props.module.module_id);
					this.props.onOwnershipChange(ownership);
				}else{
					//TODO: add error modal
				}
			})
			.catch(error => {
				console.log(error);
			});
		} else {
			axios.delete(`/marketplace/user_module/${this.props.module.module_id}`)
			.then(res => {
				if(res.status === 200){
					let ownership = this.props.ownership;
					ownership.delete(this.props.module.module_id);
					this.props.onOwnershipChange(ownership);
				}else{
					//TODO: add error modal
				}
			})
			.catch(error => {
				console.log(error);
			});
		}
	}

	render(){
		return (
			<div className="card-container">
				<Card 
					onMouseEnter={() => {this.setState({hover:true})}}
					onMouseLeave={() => {this.setState({hover:false})}}
				>
					<div className="d-flex justify-content-between">
						{
							this.props.ownership.has(this.props.module.module_id)?
							<i className="far fa-check-circle mt-2 ml-2"></i>
							:
							<i className="far fa-circle mt-2 ml-2"></i>
						}

						{
							this.state.hover
							?
								<Button onClick={this.handleAddRemove} className="visible">{this.props.ownership.has(this.props.module.module_id)? "Remove" : "Add"}</Button>
							:
								<Button className="invisible">Hidden</Button>
						}
					</div>
					<CardBody className="text-center pb-0">
						<img src={this.props.module.card_icon} className="card-icon border rounded mb-1 card-link" onClick={this.props.onClick}/>
						<h5 onClick={this.props.onClick} className="card-link">{this.props.module.title}</h5>
						<p>{this.props.module.descr}</p>
						<hr className="mb-0"/>
						<div className="d-flex justify-content-center">
							<p><i className="fas fa-user-circle"></i> Created by <br/> <i className="fas fa-user-circle invisible"></i> {this.props.module.name}</p>
						</div>
					</CardBody>
				</Card>
			</div>
		)
	}


}

export default Module;