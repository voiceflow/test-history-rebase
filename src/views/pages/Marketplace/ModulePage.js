import React, { Component } from 'react';
import axios from 'axios';
import MUIButton from '@material-ui/core/Button';
import './Marketplace.css';

import categories from './../../../services/Categories';
import types from './../../../services/Types';

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
    			for(var i=0;i<categories.length;i++){
    				if(categories[i].value === res.data.category){
    					res.data.category = categories[i].label;
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
		return(
			<div className="Window">
				<div className="container">
					<div className="col-md">
						<div className="mt-5 row justify-content-center align-middle">

							<div className="col-lg">
								<h1>{this.state.module.title}</h1>
								<p>
									Created by: {this.state.module.name}
									<br/>
									{this.state.module.type} | {this.state.module.category}
								</p>
							</div>

							<div className="float-right">
								{
									this.state.has_access?
										<MUIButton variant="contained" className="purple-btn" onClick={this.handleRemoveFromLib}>Remove from Library <i className="fas fa-layer-minus"></i></MUIButton>
										:
	                            		<MUIButton variant="contained" className="purple-btn" onClick={this.handleAddtoLib}>Add to Library <i className="fas fa-layer-plus"></i></MUIButton>
								}
		                    </div>
						</div>

						<hr/>
						<div className="row justify-content-center">
							<p>{this.state.module.overview}</p>
							<h1>!!TODO: UI!!</h1>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ModulePage;