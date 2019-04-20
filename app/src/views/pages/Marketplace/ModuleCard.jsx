import React, { Component } from 'react'
import { Card, CardBody } from 'reactstrap'
import './Marketplace.css'
import ModuleIcon from './ModuleIcon'

class ModuleCard extends Component{

	render(){
		return (
			<div className="module-card-container">
				<a href="/#" onClick={(e) => {e.preventDefault(); this.props.showModuleDetailView(this.props.module)}} className="card-link">
					<Card 
						className="market-card"
					>
						<CardBody className="text-center pb-0">
							<div className="module-card-icon"><ModuleIcon module={this.props.module}/></div>
							<div className="lg-header pl-2 pr-2">{this.props.module.title}</div>
							<p className="pl-2 pr-2 text-secondary module-card-text">{this.props.module.descr}</p>
							<hr className="m-0"/>
							<div className="row w-100 justify-content-between mr-0 ml-0 p-3">
								<span className="align-middle text-secondary">{this.props.module.author}</span> 
								<div><span className="align-middle text-secondary mr-2">{this.props.module.downloads}</span><img src={'/downloads.svg'} width="16" alt="download-icon"></img></div>
							</div>
						</CardBody>
					</Card>
				</a>
			</div>
		)
	}


}

export default ModuleCard