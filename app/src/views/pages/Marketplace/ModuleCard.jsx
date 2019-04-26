import React, { Component } from 'react'
import { Card, CardBody } from 'reactstrap'
import './Marketplace.css'
import withRenderModuleIcon from 'hocs/withModuleIcon'

class ModuleCard extends Component{

	render(){
		return (
			<div className="card-container">
				<span onClick={() => {this.props.showModuleDetailView(this.props.module)}} className="card-link">
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
				</span>
			</div>
		)
	} 


}

export default withRenderModuleIcon(ModuleCard)