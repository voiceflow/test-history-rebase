import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormGroup, Label, Input } from 'reactstrap'
import MUIButton from '@material-ui/core/Button'
import moment from 'moment'
import Textarea from 'react-textarea-autosize'
import Image from './../../components/Uploads/Image'
import Select from 'react-select'
import VariableMap from './VariableMap'

import axios from 'axios'
import '../Skill/Skill.css'
import './PublishMarket.css'
import types from './../../../services/Types'
import { setConfirm, clearModal } from 'actions/modalActions'

class PublishMarket extends Component {
	constructor(props){
		super(props);

        this.state = {
            saved: true,
            skill_id: this.props.skill.skill_id,
            descr: '',
            overview: '',
            error: '',
            in_review: false,
            title: '',
            module_icon: null,
            color: '',
            input: [],
            output: [],
            show_incomp_alert: false,
            variables: [],
            tags: [],
            tags_input: ''
        }

        this.handleTypeSelection = this.handleTypeSelection.bind(this)
        this.toggleConfirmWithdraw = this.toggleConfirmWithdraw.bind(this)
        this.onWithdraw = this.onWithdraw.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.save = this.save.bind(this)
        this.publish = this.publish.bind(this)
        this.onLoad = this.onLoad.bind(this)
        this.handleAddVar = this.handleAddVar.bind(this)
        this.handleRemoveVar = this.handleRemoveVar.bind(this)
        this.handleVarChange = this.handleVarChange.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.handleAddTag = this.handleAddTag.bind(this)
        this.handleDeleteTag = this.handleDeleteTag.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
    }

	handleTypeSelection(value) {
		this.setState({
            saved: false,
            type: value
        });
	}

    handleAddTag(){
        if(this.state.tags.length < 3){
            let curr_tags = this.state.tags
            curr_tags.push(this.state.tags_input)
            this.setState({
                saved: false,
                tags: curr_tags,
                tags_input: ''
            })
        } else {
            this.setState({
                failed_tag_add: true
            })
        }
    }

    handleDeleteTag(i){
        let curr_tags = this.state.tags
        curr_tags.splice(i, 1)
        this.setState({
            saved: false,
            tags: curr_tags,
            failed_tag_add: false
        })
    }

	handleChange(event){
        this.setState({
            saved: false,
            [event.target.name]: event.target.value
        })
    }

    handleKeyPress = (event) => {
        if(event.target.name === 'tags_input' && event.key === 'Enter'){
            this.handleAddTag()
        }
    }

    handleUpdate(){
        this.setState({
            saved: false
        });
    }

    onLoad(){
    	axios.get('/marketplace/cert/' + this.state.skill_id)
    	.then(res => {
    		if(res.data.type){
    			for(var j=0;j<types.length;j++){
    				if(types[j].value === res.data.type){
    					res.data.type = {label: types[j].label, value:res.data.type}
    				}
    			}
    		}

            // Parse some JSUN
            res.data.input = JSON.parse(res.data.input)
            res.data.output = JSON.parse(res.data.output)
            res.data.tags = JSON.parse(res.data.tags)

    		this.setState({
    			...res.data
            });
    	})
    	.catch(res => {
    		// Non-existant keep default vals
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
        const type = (s.type && s.type.value ? s.type.value : null);
        axios.patch('/marketplace/cert/' + this.state.skill_id, {
            title: s.title,
            descr: s.descr,
            creator_id: this.props.user.id,
            tags: JSON.stringify(s.tags),
            type: type,
            overview: s.overview,
            module_icon: s.module_icon,
            color: s.color,
            input: JSON.stringify(s.input),
            output: JSON.stringify(s.output),
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
        if (s.title && s.descr && s.tags && s.type && s.overview && s.module_icon){
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
            })
            this.props.clearModal()
        })
        .catch(err => {
        	console.log(err);
        	this.setState({
        		error: 'Withdrawal Error, failed to withdraw'
        	})
        });
    }

    toggleConfirmWithdraw() {
        if(!this.props.confirmModal){
            this.props.setConfirm({
                text: "Are you sure you want to withdraw this Skill?",
                confirm: this.onWithdraw
            });
        }else{
            this.props.clearModal()
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
                        <span className="text-muted">
                            <span className="text-secondary">{this.props.skill.name}</span>{' '}
                            <small> / created {moment(this.props.skill.created).fromNow()}</small>
                        </span>
                        {
                        	this.state.in_review?
                        	null
                        	:
	                        <div className="subheader-right">

	                            <MUIButton variant="contained" className="white-btn mr-3" onClick={this.save}>Save Draft{this.state.saved ? '':'*'}</MUIButton>
	                            <MUIButton variant="contained" className="purple-btn" onClick={this.publish}>Submit to Marketplace <i className="fas fa-store-alt ml-2"/></MUIButton>
	                        </div>
                    	}
                    </div>
                </div>

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
                            <p>Title</p>
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
                            <p>Icon</p>
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
                            {this.state.tags?
                                <i className="fal fa-check-circle text-success"></i>
                                :
                                <i className="fal fa-times-circle text-danger"></i>
                            }
                        </div>
                        <div className="col-10">
                            <p>Tags</p>
                        </div>
                    </div>
                </span>

				<div className="container mt-3">
					{this.state.in_review?
		                <div className="alert alert-success mb-4" role="alert">
		                    <div className="d-flex justify-content-between align-items-center">
		                        <h5 className="mb-0">This skill is currently being reviewed for the Marketplace.</h5>
		                        <div>
		                            <MUIButton variant="contained" className="purple-btn ml-3" onClick={this.toggleConfirmWithdraw}>Withdraw Submission</MUIButton>
		                        </div>
		                    </div>
		                </div>
		            	:
		            	null
		            }

                    {this.state.show_incomp_alert?
                        <div className="alert alert-danger mb-4" role="alert">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Missing essential information about your {this.state.type === 'FLOW'? "flow": "template"}.</h5>
                            </div>
                        </div>
                        :
                        null
                    }

					<FormGroup>
						<div className="row">
                            <div className="col-3 publish-info"></div>
                            <div className="col-9">
                                <Label><b>Title </b>*</Label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3 publish-info">
                                <p className="mb-0 text-secondary"><b>Title</b> is what we display for your skill on the Marketplace.</p>
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
                                    <b>Description</b> is a summary of your {this.state.type === 'FLOW'? "flow": "template"} that shows on your {this.state.type === 'FLOW'? "flow": "template"}'s card on the Marketplace. 
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
                                    <b>Overview</b> is a detailed description of your {this.state.type === 'FLOW'? "flow": "template"}. Feel free to put as much information in this section! If you're using variables, writing
                                    detailed descriptions is essential for your user's understanding. 
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
                            <p className="text-secondary mt-5"><b>Icon</b> will be displayed for your {this.state.type === 'FLOW'? "flow": "template"} in the Voiceflow editor.</p>
                        </div>
                        <div className="col-9 d-flex">
                            <div>
                                <label className="mt-0"><b>Icon</b> *</label>
                                <Image
                                    path='/large_icon'
                                    max_size={512*1024}
                                    isDisabled={this.state.in_review}
                                    image={this.state.module_icon} 
                                    update={(url) => this.setState({module_icon: url})}/>
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
                                    Your skill can be one of two <b>types</b>, either a flow or a template. If another creator users your flow, they won't be able to look into your flow diagram, whereas with a template they can.
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
                                <Label><b>Tags *</b></Label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3 publish-info">
                                <p className="text-secondary">
                                    <b>Tags</b> is a comma-separated list of tags that helps users find your {this.state.type === 'FLOW'? "flow": "template"} more easily.
                                </p>
                            </div>
                            <div className="col-9">
                                {this.state.tags.map((tag, i) => 
                                    <span key={i} className="publish-tag">
                                        {tag} <i className="fal fa-times ml-1" onClick={() => {this.handleDeleteTag(i)}}></i>
                                    </span>
                                )}
                                {
                                    this.state.failed_tag_add?
                                    <div className="alert alert-danger pt-1 pb-1 mt-2" role="alert">
                                        3 tag maximum
                                    </div>
                                    :
                                    null
                                }
                                <Input type="text" 
                                    name="tags_input" 
                                    placeholder="Add tags" 
                                    value={this.state.tags_input} 
                                    disabled={this.state.in_review} 
                                    onChange={this.handleChange}
                                    onKeyPress={this.handleKeyPress}/>
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
                    
                    
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
    confirmModal: state.modal.confirmModal
})

const mapDispatchToProps = dispatch => {
    return {
        setConfirm: (confirm) => dispatch(setConfirm(confirm)),
        clearModal: () => dispatch(clearModal()),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PublishMarket);