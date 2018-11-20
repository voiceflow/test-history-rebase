import React, { Component } from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import MUIButton from '@material-ui/core/Button';
import moment from 'moment';
import Textarea from 'react-textarea-autosize';
import Image from './../../components/Uploads/Image';
import Select from 'react-select';
import ConfirmModal from './../../components/Modals/ConfirmModal';
import VariableMap from './VariableMap';

import axios from 'axios';
import '../Skill/Skill.css';
import categories from './../../../services/Categories';
import types from './../../../services/Types';

class PublishMarket extends Component {
	constructor(props){
		super(props);

		if(this.props.computedMatch && this.props.computedMatch.params.id){
            this.state = {
                saved: true,
                skill_id: this.props.computedMatch.params.id,
                descr: '',
                overview: '',
                card_icon: 'https://s3.amazonaws.com/com.getstoryflow.api.images/default_module_card_icon.png',
                error: '',
                in_review: false,
                title: '',
                module_icon: '',
                displayingConfirmWithdraw: false,
                color: '',
                input: [],
                output: [],
                show_incomp_alert: false,
                variables: []
            }
        } else {
            this.props.history.push('/dashboard');
        }

        this.handleTypeSelection = this.handleTypeSelection.bind(this);
        this.handleCategorySelection = this.handleCategorySelection.bind(this);
        this.toggleConfirmWithdraw = this.toggleConfirmWithdraw.bind(this);
        this.onWithdraw = this.onWithdraw.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.save = this.save.bind(this);
        this.publish = this.publish.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.handleAddVar = this.handleAddVar.bind(this);
        this.handleRemoveVar = this.handleRemoveVar.bind(this);
        this.handleVarChange = this.handleVarChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.testApprove = this.testApprove.bind(this);
	}

    testApprove(){
        axios.put(`/marketplace/cert/${this.state.skill_id}`)
        .then(res => {
            console.log("I think it worked")
        }) 
        .catch(res => {
            console.log("DAFUQ")
        });
    }

	handleTypeSelection(value) {
		this.setState({
            saved: false,
            type: value
        });
	}

	handleCategorySelection(value) {
		this.setState({
            saved: false,
            category: value
        });
	}

	handleChange(event){
        this.setState({
            saved: false,
            [event.target.name]: event.target.value
        });
    }

    handleUpdate(){
        this.setState({
            saved: false
        });
    }

    onLoad(){
    	axios.get('/marketplace/cert/' + this.state.skill_id)
    	.then(res => {
    		if(res.data.category){
    			for(var i=0;i<categories.length;i++){
    				if(categories[i].value === res.data.category){
    					res.data.category = {label: categories[i].label, value:res.data.category};
    				}
    			}
    		}

    		if(res.data.type){
    			for(var j=0;j<types.length;j++){
    				if(types[j].value === res.data.type){
    					res.data.type = {label: types[j].label, value:res.data.type};
    				}
    			}
    		}

            res.data.input = JSON.parse(res.data.input);
            res.data.output = JSON.parse(res.data.output);

    		this.setState({
    			...res.data
    		});
    	})
    	.catch(res => {
    		// Non-existant
    	});

    	axios.get('/marketplace/cert/status/' + this.state.skill_id)
    	.then(res => {
    		this.setState({
    			in_review: res.data
    		});
    	})
    	.catch(res => {
    	});


    }

    save(){
        const s = this.state;
        const category = (s.category && s.category.value ? s.category.value : null);
        const type = (s.type && s.type.value ? s.type.value : null);

        axios.patch('/marketplace/cert/' + this.state.skill_id, {
            title: s.title,
            descr: s.descr,
            card_icon: s.card_icon,
            creator_id: this.props.user.id,
            category: category,
            type: type,
            overview: s.overview,
            module_icon: s.module_icon,
            color: s.color,
            input: JSON.stringify(s.input),
            output: JSON.stringify(s.output)
        })
        .then(res => {
            this.setState({
                saved: true
            });
        })
        .catch(err => {
            console.log(err);
            this.setState({
                error: 'Save Error, updates not saved'
            });
        });
    }

    publish(){
    	this.save();
        let s = this.state;
        if (s.title && s.descr && s.card_icon && s.category && s.type && s.overview && s.module_icon){
        	axios.post('/marketplace/cert/' + this.state.skill_id)
            .then(res => {
                this.setState({
                    saved: true,
                    in_review: true,
                    show_incomp_alert: false
                });
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    error: 'Publish Error, failed to publish',
                    show_incomp_alert: false
                });
            });
        } else {
            this.setState({
                show_incomp_alert: true
            })
        }
    }

    onWithdraw(){
        axios.delete('/marketplace/cert/' + this.state.skill_id)
        .then(res => {
        	this.setState({
        		in_review: false,
        		displayingConfirmWithdraw: false
        	})
        })
        .catch(err => {
        	console.log(err);
        	this.setState({
        		error: 'Withdrawal Error, failed to withdraw'
        	})
        });
    }

    toggleConfirmWithdraw() {
        if(!this.state.displayingConfirmWithdraw){
            this.setState({
                displayingConfirmWithdraw: {
                    text: "Are you sure you want to withdraw this Skill?",
                    confirm: this.onWithdraw
                }
            });
        }else{
            this.setState({
                displayingConfirmWithdraw: false
            }); 
        }
    }

    componentDidMount() {
        this.onLoad();
    }

    handleAddVar(type){
        let curr_state = this.state;
        curr_state[type].push('');
        curr_state.saved = false;
        this.setState(curr_state);
    }

    handleRemoveVar(i, type) {
        let curr_state = this.state;
        curr_state[type].splice(i, 1);
        curr_state.saved = false;
        this.setState(curr_state);
    }

    handleVarChange(val, i, type) {
        let curr_state = this.state;
        curr_state[type][i] = val;
        curr_state.saved = false;
        this.setState(curr_state);
    }

	render(){
		return(
			<div className="Window skill">
				<div className="subheader">
                    <div className="container space-between">
                        <span className="subheader-title">
                            <b>Settings</b>
                            <div className="hr-label">
                                <small><i className="far fa-user mr-1"></i></small> {this.props.user.name}{' '}
                                <small><i className="far fa-chevron-right"/></small>{' '}
                                <span className="text-secondary">{this.state.title}</span>{' '}
                                <small> / created {moment(this.state.created).fromNow()}</small>
                            </div>
                        </span>

                        {
                        	this.state.in_review?
                        	null
                        	:
	                        <div className="subheader-right">
	                            <MUIButton variant="contained" className="white-btn mr-3" onClick={this.save}>Save Draft{this.state.saved ? '':'*'}</MUIButton>
	                            <MUIButton variant="contained" className="purple-btn" onClick={this.publish}>Publish Skill <i className="fas fa-store-alt ml-2"/></MUIButton>
	                        </div>
                    	}
                    </div>
                </div>

                <ConfirmModal 
                    confirm = {this.state.displayingConfirmWithdraw}
                    toggle = {this.toggleConfirmWithdraw}
                />

                <span className="container position-fixed bg-white mt-3 ml-2 mr-2 border p-3 pb-0 rounded" id="publish-status">
                    <div className="row justify-content-center">
                        <h3>Status</h3>
                    </div>
                    <hr className="mt-0"></hr>
                    <div className="row">
                        <div className="col-2">
                            {this.state.title?
                                <i className="fal fa-check-circle text-success"></i>
                                :
                                <i className="fal fa-times-circle text-danger"></i>
                            }
                        </div>
                        <div className="col-10">
                            <p>Module Title</p>
                        </div>
                    </div>
                    <hr className="mt-0"></hr>
                    <div className="row">
                        <div className="col-2">
                            {this.state.descr?
                                <i className="fal fa-check-circle text-success"></i>
                                :
                                <i className="fal fa-times-circle text-danger"></i>
                            }
                        </div>
                        <div className="col-10">
                            <p>Description</p>
                        </div>
                    </div>
                    <hr className="mt-0"></hr>
                    <div className="row">
                        <div className="col-2">
                            {this.state.overview?
                                <i className="fal fa-check-circle text-success"></i>
                                :
                                <i className="fal fa-times-circle text-danger"></i>
                            }
                        </div>
                        <div className="col-10">
                            <p>Overview</p>
                        </div>
                    </div>
                    <hr className="mt-0"></hr>
                    <div className="row">
                        <div className="col-2">
                            {this.state.module_icon?
                                <i className="fal fa-check-circle text-success"></i>
                                :
                                <i className="fal fa-times-circle text-danger"></i>
                            }
                        </div>
                        <div className="col-10">
                            <p>Module Icon</p>
                        </div>
                    </div>
                    <hr className="mt-0"></hr>
                    <div className="row">
                        <div className="col-2">
                            {this.state.type?
                                <i className="fal fa-check-circle text-success"></i>
                                :
                                <i className="fal fa-times-circle text-danger"></i>
                            }
                        </div>
                        <div className="col-10">
                            <p>Type</p>
                        </div>
                    </div>
                    <hr className="mt-0"></hr>
                    <div className="row">
                        <div className="col-2">
                            {this.state.category?
                                <i className="fal fa-check-circle text-success"></i>
                                :
                                <i className="fal fa-times-circle text-danger"></i>
                            }
                        </div>
                        <div className="col-10">
                            <p>Category</p>
                        </div>
                    </div>
                </span>

				<div className="container mt-3">
					{this.state.in_review?
		                <div className="alert alert-success mb-4" role="alert">
		                    <div className="d-flex justify-content-between align-items-center">
		                        <h5 className="mb-0">This skill is currently in review so you cannot edit it.</h5>
		                        <div>
		                            <MUIButton variant="contained" className="purple-btn ml-3" onClick={this.toggleConfirmWithdraw}>Withdraw Skill</MUIButton>
		                        </div>
		                    </div>
		                </div>
		            	:
		            	null
		            }

                    {this.state.show_incomp_alert?
                        <div className="alert alert-danger mb-4" role="alert">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Missing essential information about your module.</h5>
                            </div>
                        </div>
                        :
                        null
                    }

					<FormGroup>
						<div className="row">
                            <div className="col-3 publish-info"></div>
                            <div className="col-9">
                                <Label><b>Module Title </b>*</Label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3 publish-info">
                                <p className="mb-0 text-secondary"><b>Module Title</b> is what we display for your skill on the Marketplace.</p>
                            </div>
                            <div className="col-9">
                                <Input type="text" name="title" placeholder="Storyflow - Interactive Story Adventures" value={this.state.title} disabled={this.state.in_review} onChange={this.handleChange}/>
                            </div>
                        </div>
					</FormGroup>

					<FormGroup>
						<div className="row">
                            <div className="col-3 publish-info"></div>
                            <div className="col-9">
                                <Label><b>Description </b>*</Label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3 publish-info">
                                <p className="text-secondary">
                                    <b>Description</b> is a summary of your module that shows on your module's card on the Marketplace. 
                                </p>
                            </div>
                            <div className="col-9">
                                <Textarea
                                    name="descr"
                                    className="form-control"
                                    disabled={this.state.in_review}
                                    value={this.state.descr}
                                    onChange={this.handleChange}
                                    minRows={3}
                                    placeholder="Module description"
                                />
                            </div>
                        </div>
					</FormGroup>

					<FormGroup>
						<div className="row">
                            <div className="col-3 publish-info"></div>
                            <div className="col-9">
                                <Label><b>Overview </b>*</Label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3 publish-info">
                                <p className="text-secondary">
                                    <b>Overview</b> is a detailed description of your module. Feel free to put as much information in this section! 
                                </p>
                            </div>
                            <div className="col-9">
                                <Textarea
                                    name="overview"
                                    className="form-control"
                                    disabled={this.state.in_review}
                                    value={this.state.overview}
                                    onChange={this.handleChange}
                                    minRows={3}
                                    placeholder="Module overview"
                                />
                            </div>
                        </div>
					</FormGroup>

                    <div className="d-flex row">
                        <div className="col-3 publish-info">
                            <p className="text-secondary mt-5"><b>Module icon</b> will be displayed for your module in the Voiceflow editor.</p>
                        </div>
                        <div className="col-9 d-flex">
                            <div>
                                <label className="mt-0"><b>Module icon</b> *</label>
                                <Image 
                                    className='icon-image small-icon'
                                    path='/module_icon'
                                    isDisabled={this.state.in_review}
                                    image={this.state.module_icon} 
                                    update={(url) => this.setState({module_icon: url})}/>
                            </div>
                        </div>
                    </div>

					<div className="d-flex row">
                        <div className="col-3 publish-info">
                            <p className="text-secondary mt-5">Card icon will be displayed for your module in our Marketplace.</p>
                        </div>
                        <div className="col-9 d-flex">
                            <div>
                                <label className="mt-0"><b>Card icon</b> *</label>
                                <Image 
                                    className='icon-image small-icon'
                                    path='/card_icon'
                                    isDisabled={this.state.in_review}
                                    image={this.state.card_icon} 
                                    update={(url) => this.setState({card_icon: url})}/>
                            </div>
                        </div>
                    </div>

                    <FormGroup>
                        <div className="row">
                            <div className="col-3 publish-info"></div>
                            <div className="col-9">
                                <Label><b>Type *</b></Label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3 publish-info">
                                <p className="text-secondary">
                                    Modules can be one of two <b>types</b>, either a Flow or a Template. If another creator users your Flow, they won't be able to dive into your flow diagram, whereas with a template they can.
                                </p>
                            </div>
                            <div className="col-9">
                                <Select
                                    className="input-select"
                                    name="type"
                                    isDisabled={this.state.in_review}
                                    value={this.state.type}
                                    onChange={this.handleTypeSelection}
                                    options={types}
                                />
                            </div>
                        </div>
                    </FormGroup>

                    <FormGroup>
                        <div className="row">
                            <div className="col-3 publish-info"></div>
                            <div className="col-9">
                                <Label><b>Category *</b></Label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3 publish-info">
                                <p className="text-secondary">
                                    <b>Category</b> helps users find your module more easily so choose the category that best applies to your module.
                                </p>
                            </div>
                            <div className="col-9">
                                <Select
                                    className="input-select"
                                    name="category"
                                    isDisabled={this.state.in_review}
                                    value={this.state.category}
                                    onChange={this.handleCategorySelection}
                                    options={categories}
                                />
                            </div>
                        </div>
                    </FormGroup>

                    {/*
                    <FormGroup>
                        <div className="row">
                            <div className="col-3 publish-info"></div>
                            <div className="col-9">
                                <Label><b>Block Color </b>*</Label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3 publish-info">
                                <p className="mb-0 text-secondary"><b>Block color</b> is the hexcode color your block will appear as.</p>
                            </div>
                            <div className="col-9">
                                <Input type="text" name="color" placeholder="6CD132" value={this.state.color} disabled={this.state.in_review} onChange={this.handleChange}/>
                            </div>
                        </div>
                    </FormGroup>
                    */}

                    {this.state.type && this.state.type.value === 'FLOW'?
                        <React.Fragment>
                            <div className="row">
                                <div className="col-3 publish-info"></div>
                                <div className="col-9">
                                    <Label>Input Variables</Label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-3 publish-info">
                                    <p className="mb-0 text-secondary"><b>Input variables</b> are the variables that will be available for input mapping when users use your module.</p>
                                </div>
                                <div className="col-9">
                                    <VariableMap
                                        pairs={this.state.input}
                                        onAdd={(e, type) => this.handleAddVar('input')}
                                        onRemove={(e, i, type) => this.handleRemoveVar(i, 'input')}
                                        onChange={(e, val, i, type) => this.handleVarChange(e, val, i, 'input')}
                                        type='input'
                                        variables={this.state.variables}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-3 publish-info"></div>
                                <div className="col-9">
                                    <Label>Output Variables</Label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-3 publish-info">
                                    <p className="mb-0 text-secondary"><b>Output variables</b> are the variables that will be available for output mapping when users use your module.</p>
                                </div>
                                <div className="col-9">
                                    <VariableMap
                                        pairs={this.state.output}
                                        onAdd={(e, type) => this.handleAddVar('output')}
                                        onRemove={(e, i, type) => this.handleRemoveVar(i, 'output')}
                                        onChange={(e, val, i, type) => this.handleVarChange(e, val, i, 'output')}
                                        type='output'
                                        variables={this.state.variables}
                                    />
                                </div>
                            </div>
                        </React.Fragment>
                        :
                        null
                    }
                    
                    <div>
                        <MUIButton variant="contained" className="white-btn mr-3" onClick={this.testApprove}>TEST</MUIButton>
                    </div>
				</div>
			</div>
		);
	}
}

export default PublishMarket;