import React, { Component } from 'react';
import { Card, CardBody, Button } from 'reactstrap';
import './Marketplace.css';
import axios from 'axios';

class ModuleCard extends Component{
	constructor(props){
		super(props)

		this.state = {
			hover: false
		}

		this.handleModuleView = this.handleModuleView.bind(this)
		this.handleAddRemove = this.handleAddRemove.bind(this)
		this.renderIcon = this.renderIcon.bind(this)
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

	renderIcon(){
		let name = this.props.module.title.match(/\b(\w)/g)
		if(name) { name = name.join('') }
		else { name = this.props.module.title }
		name = name.substring(0,3)
		
		let module_colors = this.props.module.color.split('|')
		if(module_colors.length === 1){
				module_colors = ['F86683', 'FEF2F4']
		}

		let icon_style = {
				backgroundColor: `#${module_colors[1]}`,
				color: `#${module_colors[0]}`
		}
		
		return <div className="module-card-icon"><div className="no-image module-image" style={icon_style}><h1>{name}</h1></div></div>
	}

	render(){
		return (
			<div className="card-container">
				<a onClick={this.props.showModuleDetailView} className="card-link">
					<Card 
											className="market-card"
						onMouseEnter={() => {this.setState({hover:true})}}
						onMouseLeave={() => {this.setState({hover:false})}}
					>
						{/* <div className="d-flex justify-content-between">
							{
								this.props.ownership.has(this.props.module.module_id)?
								<i className="checkbox-active fas fa-check"></i>
								:
								<i className="checkbox"></i>
							}
						</div> */}
						<CardBody className="text-center pb-0">
							{/* <img src={this.props.module.module_icon} className="card-icon border rounded mb-3 card-link" alt="Card icon" onClick={this.props.onClick}/> */}
							{this.renderIcon()}
							<h5 onClick={this.props.onClick}>{this.props.module.title}</h5>
							<p className="text-secondary module-card-text">{this.props.module.descr}</p>
							{/* <hr className="mb-2"/>
							<div className="d-flex creator-class">
								<p className="text-secondary"><small className="small-blue">CREATED BY</small><br/><i className="fas fa-user-circle invisible"></i> {this.props.module.name}</p>
							</div> */}
							{/* {
								this.state.hover
								?
									<Button className="add-btn" onClick={this.handleAddRemove}>{this.props.ownership.has(this.props.module.module_id)? "Remove" : "Add"}</Button>
								:
									<Button className="nonhover-btn" onClick={this.handleAddRemove}>{this.props.ownership.has(this.props.module.module_id)? "Remove" : "Add"}</Button>
							} */}
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

export default ModuleCard;