import React, { Component } from 'react';
import { Button, Jumbotron, Container } from 'reactstrap';
import './Marketplace.css';
import axios from 'axios';

class BannerCarousel extends Component{
	constructor(props){
		super(props);
		this.handleAddRemove = this.handleAddRemove.bind(this);
	}

	handleAddRemove(i) {
		if(!this.props.ownership.has(this.props.featured_modules[i].module_id)){
			axios.post(`/marketplace/user_module/${this.props.featured_modules[i].module_id}`)
			.then(res => {
				if(res.status === 200){
					let ownership = this.props.ownership;
					ownership.add(this.props.featured_modules[i].module_id);
					this.props.onOwnershipChange(ownership);
				}else{
					//TODO: add error modal
				}
			})
			.catch(error => {
				console.log(error);
			});
		} else {
			axios.delete(`/marketplace/user_module/${this.props.featured_modules[i].module_id}`)
			.then(res => {
				if(res.status === 200){
					let ownership = this.props.ownership;
					ownership.delete(this.props.featured_modules[i].module_id);
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
		var currentModule1 = 
			<div className="container border rounded">
				<div className="d-flex justify-content-between mt-3">
					<img src={this.props.featured_modules[0].card_icon} className="card-icon border rounded mb-1"/>
					<Button className="" onClick={() => {this.handleAddRemove(0)}}>{this.props.ownership.has(this.props.featured_modules[0].module_id)? "Remove" : "Add"}</Button>
				</div>
				<div className="row ml-2">
					<h1>{this.props.featured_modules[0].title}</h1>
				</div>
				<div className="row ml-2">
					<p>{this.props.featured_modules[0].descr}</p>
				</div>
			</div>

		var currentModule2 = 
			<div className="container border rounded">
				<div className="d-flex justify-content-between mt-3">
					<img src={this.props.featured_modules[1].card_icon} className="card-icon border rounded mb-1"/>
					<Button className="" onClick={() => {this.handleAddRemove(1)}}>{this.props.ownership.has(this.props.featured_modules[1].module_id)? "Remove" : "Add"}</Button>
				</div>
				<div className="row ml-2">
					<h1>{this.props.featured_modules[1].title}</h1>
				</div>
				<div className="row ml-2">
					<p>{this.props.featured_modules[1].descr}</p>
				</div>
			</div>

		return (
			<div className="container">
				<div className="row">
					<h1 className="pl-3">Featured Flows</h1>
				</div>
				<div className="row">
					<div className="col-md">
						{currentModule1}
					</div>
					<div className="col-md">
						{currentModule2}
					</div>
				</div>
			</div>
		)
	}


}

export default BannerCarousel;