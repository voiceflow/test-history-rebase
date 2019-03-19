import React, { Component } from 'react';
import { Card, CardBody } from 'reactstrap';
import './Marketplace.css';
import axios from 'axios';
import withRenderModuleIcon from '../../HOC/ModuleIcon'

class ModuleCard extends Component{
	constructor(props){
		super(props)

		this.state = {
			hover: false
		}

		this.handleModuleView = this.handleModuleView.bind(this)
		this.handleAddRemove = this.handleAddRemove.bind(this)
	}

	handleModuleView() {
		this.props.history.push(`/marketplace/${this.props.skill_id}/${this.props.module.module_id}`)
	}
    	

	handleAddRemove() {
		if(!this.props.ownership.has(this.props.module.module_id)){
			axios.post(`/marketplace/user_module/${this.props.module.module_id}`)
			.then(res => {
				if(res.status === 200){
					let ownership = this.props.ownership
					ownership.add(this.props.module.module_id)
					this.props.onOwnershipChange(ownership)
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
				<a onClick={() => {this.props.showModuleDetailView(this.props.module)}} className="card-link">
					<Card 
											className="market-card"
						onMouseEnter={() => {this.setState({hover:true})}}
						onMouseLeave={() => {this.setState({hover:false})}}
					>
						<CardBody className="text-center pb-0">
							{this.props.renderIcon(this.props.module)}
							<h5 onClick={this.props.onClick}>{this.props.module.title}</h5>
							<p className="text-secondary module-card-text">{this.props.module.descr}</p>
							<hr className="m-0"/>
							<div className="row w-100 justify-content-between mr-0 ml-0 p-3">
								<span className="align-middle text-secondary">{this.props.module.name}</span> 
								<span className="align-middle text-secondary">{this.props.module.votes} <i className="fas fa-long-arrow-alt-up"></i></span> 
							</div>
						</CardBody>
					</Card>
				</a>
			</div>
		)
	}


}

export default withRenderModuleIcon(ModuleCard)