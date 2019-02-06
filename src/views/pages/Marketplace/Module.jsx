import React, { Component } from 'react';
import { Card, CardBody, Button } from 'reactstrap';
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
                    className="market-card"
					onMouseEnter={() => {this.setState({hover:true})}}
					onMouseLeave={() => {this.setState({hover:false})}}
				>
					<div className="d-flex justify-content-between">
						{
							this.props.ownership.has(this.props.module.module_id)?
							<i className="checkbox-active fas fa-check"></i>
							:
							<i className="checkbox"></i>
						}
					</div>
					<CardBody className="text-center pb-0">
						<img src={this.props.module.module_icon} className="card-icon border rounded mb-3 card-link" alt="Card icon" onClick={this.props.onClick}/>
						<h5 onClick={this.props.onClick} className="card-link">{this.props.module.title}</h5>
						<p className="text-secondary">{this.props.module.descr}</p>
						<hr className="mb-2"/>
						<div className="d-flex creator-class">
							<p className="text-secondary"><small className="small-blue">CREATED BY</small><br/><i className="fas fa-user-circle invisible"></i> {this.props.module.name}</p>
						</div>
                        {
							this.state.hover
							?
								<Button className="add-btn" onClick={this.handleAddRemove}>{this.props.ownership.has(this.props.module.module_id)? "Remove" : "Add"}</Button>
							:
								<Button className="nonhover-btn" onClick={this.handleAddRemove}>{this.props.ownership.has(this.props.module.module_id)? "Remove" : "Add"}</Button>
						}
					</CardBody>
				</Card>
			</div>
		)
	}


}

export default Module;