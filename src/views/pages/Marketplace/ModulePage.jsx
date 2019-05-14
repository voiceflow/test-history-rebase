import React, { Component } from 'react';
import axios from 'axios';

import { AMAZON_CATEGORIES } from './../../../services/Categories';
import types from './../../../services/Types';

import Button from 'components/Button'

import "./Marketplace.css";

class ModulePage extends Component{
	constructor(props){
		super(props);
		this.state = {
			module: {
				title: null,
				name: null,
				category: null,
				type: null,
				overview: null
			},
			has_access: false
		}
		this.onLoadModule = this.onLoadModule.bind(this);
		this.handleAddtoLib = this.handleAddtoLib.bind(this);
		this.handleRemoveFromLib = this.handleRemoveFromLib.bind(this);
	}

	onLoadModule(){
		axios.get(`/marketplace/${this.props.computedMatch.params.module_id}`)
        .then(res => {
        	if(res.data.category){
    			for(var i=0;i<AMAZON_CATEGORIES.length;i++){
    				if(AMAZON_CATEGORIES[i].value === res.data.category){
    					res.data.category = AMAZON_CATEGORIES[i].label;
    				}
    			}
    		}

    		if(res.data.type){
    			for(var j=0;j<types.length;j++){
    				if(types[j].value === res.data.type){
    					res.data.type = types[j].label;
    				}
    			}
    		}

            this.setState({
                module: res.data,
                skill_id: this.props.computedMatch.params.module_id
            });
        })
        .catch(error => {
            console.log(error);
        });

        axios.get(`/marketplace/user_module/${this.props.computedMatch.params.module_id}`)
        .then(res => {
            this.setState({
                has_access: res.data,
            });
        })
        .catch(error => {
            console.log(error);
        });
	}

	componentDidMount() {
        this.onLoadModule();
    }

    handleAddtoLib() {
    	axios.post(`/marketplace/user_module/${this.props.computedMatch.params.module_id}`)
    	.then(res => {
            if(res.status === 200){
            	this.setState({
            		has_access: true
            	})
            }else{
            	//TODO: add error modal
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    handleRemoveFromLib() {
    	axios.delete(`/marketplace/user_module/${this.props.computedMatch.params.module_id}`)
    	.then(res => {
            if(res.status === 200){
            	this.setState({
            		has_access: false
            	})
            }else{
            	//TODO: add error modal
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

	render(){
		let creation_date = ''
		if(this.state.module.created){
			creation_date = this.state.module.created.substring(0, this.state.module.created.indexOf("T"))
		}
		return(
			<div className="container h-100 d-flex justify-content-center">
			    <div className="my-auto border rounded p-4 text-center module-page-card">
					<img src={this.state.module.module_icon} className="card-icon-2" alt="card icon"></img>
			    	<h1 className="big-blue mt-3">
						{this.state.module.title}
					</h1>
					<p className="sub-head mt-1">{this.state.module.name} on {creation_date}</p>
					<br/>
					<p className="description mb-5">{this.state.module.overview}</p>

					{
                    	this.state.has_access?
                    	<Button isPrimary variant="contained" className="mb-3" onClick={this.handleRemoveFromLib}>Remove from Library <i className="fas fa-layer-minus ml-2"></i></Button>
                        :
                        <Button isPrimary variant="contained" onClick={this.handleAddtoLib}>Add to Library <i className="fas fa-layer-plus ml-2"></i></Button>
                    }
			    </div>
			</div>
		);
	}
}

export default ModulePage;