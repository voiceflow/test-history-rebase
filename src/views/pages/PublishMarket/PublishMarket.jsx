import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormGroup, Label, Input, Form } from 'reactstrap'
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
        this.toggleConfirmSubmission = this.toggleConfirmSubmission.bind(this)
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
    	axios.get('/marketplace/cert/' + this.props.project_id)
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

    	axios.get('/marketplace/cert/status/' + this.props.project_id)
    	.then(res => {
    		this.setState({
    			in_review: res.data
    		});
    	})
    	.catch(res => {
    	});
    }

    save = () => new Promise(async (resolve, reject) => {
        const s = this.state
        // const type = (s.type && s.type.value ? s.type.value : null);
        const type = 'FLOW'
        try{
            await axios.patch('/marketplace/cert/' + this.props.project_id, {
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
            this.setState({
                saved: true
            })
            resolve()
        } catch (err) {
            console.log(err)
            this.setState({
                error: 'Save Error, updates not saved'
            })
            reject()
        }
    })

    publish = async () => {
        await this.save()
        let s = this.state
        // if (s.title && s.descr && s.tags && s.type && s.overview && s.module_icon){
        if (s.title && s.descr && s.overview){
        	axios.post(`/marketplace/cert/${this.state.skill_id}/${this.props.project_id}`)
            .then(res => {
                this.setState({
                    saved: true,
                    in_review: true,
                    show_incomp_alert: false
                })
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    error: 'Publish Error, failed to publish',
                    show_incomp_alert: false
                })
            })
        } else {
            this.setState({
                show_incomp_alert: true
            })
        }
    }

    onWithdraw(){
        axios.delete(`/marketplace/cert/${this.props.skill_id}/${this.props.project_id}`)
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
        this.props.setConfirm({
            text: "Are you sure you want to withdraw this flow?",
            confirm: this.onWithdraw
        })
    }

    toggleConfirmSubmission(){
        this.props.setConfirm({
            text: "Are you sure you want to publish this flow?",
            confirm: this.publish
        })
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
            <React.Fragment>
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
                    {/* <hr className="mt-0"></hr>
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
                    </div> */}
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
                </span>

                <div className="subheader-page-container">
                    <div>
                        <div className="container pt-3">

                            {this.state.in_review?
                                <div className="alert alert-success mb-4" role="alert">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>This skill is currently being reviewed for the Marketplace.</span>
                                        <div>
                                            <MUIButton variant="contained" className="purple-btn ml-3" onClick={this.toggleConfirmWithdraw}>Withdraw Submission</MUIButton>
                                        </div>
                                    </div>
                                </div>
                                :
                                null
                            }

                            <Form>
                                <div className="big-settings-alignment-div">
                                    <div className="mb-4 mt-5"><b>Basic Skill Info</b></div>
                                    <div className="big-settings-content">
                                        <FormGroup>
                                            <div className="row">
                                                <div className="col-3 publish-info">
                                                    <p className="mb-0 helper-text"><b>Title</b> is what we display for your flow on the Marketplace and can be 20 characters at most.</p>
                                                </div>
                                                <div className="col-9">
                                                    <Label className="publish-label">Title *</Label>
                                                    <Input className="form-bg" type="text" name="title" placeholder="Storyflow - Interactive Story Adventures" value={this.state.title} disabled={this.state.in_review} onChange={this.handleChange} maxLength={20}/>
                                                </div>
                                            </div>
                                        </FormGroup>

                                        {/* <div className="d-flex row">
                                            <div className="col-3 helper-text">
                                                <p className="text-secondary mt-5"><b>Icon</b> will be displayed for your {this.state.type === 'FLOW'? "flow": "template"} in the Voiceflow editor.</p>
                                            </div>
                                            <div className="col-9 d-flex">
                                                <div>
                                                    <label className="mt-0"><b>Icon</b> *</label>
                                                    <Image
                                                        className="icon-image large-icon"
                                                        path='/large_icon'
                                                        max_size={512*1024}
                                                        isDisabled={this.state.in_review}
                                                        image={this.state.module_icon} 
                                                        update={(url) => this.setState({module_icon: url})}/>
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>

                                <div className="big-settings-alignment-div">
                                    <div className="mb-4 mt-5"><b>Flow Description</b></div>
                                    <div className="big-settings-content">
                                        <FormGroup>
                                            <div className="row">
                                                <div className="col-3 publish-info">
                                                    <p className="mb-0 helper-text">
                                                        <b>Description</b> is a summary of your flow that shows on its card in the Marketplace. 
                                                    </p>
                                                </div>
                                                <div className="col-9">
                                                    <Label className="publish-label">Description *</Label>
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
                                                <div className="col-3 publish-info">
                                                    <p className="mb-0 helper-text">
                                                        <b>Overview</b> is a detailed description of your flow. If you're using variables, writing a
                                                        detailed description is essential for your users' understanding. 
                                                    </p>
                                                </div>
                                                <div className="col-9">
                                                    <Label className="publish-label">Overview *</Label>
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

                                        <FormGroup>
                                            <div className="row">
                                                <div className="col-3 publish-info">
                                                    <p className="mb-0 helper-text">
                                                        Your flow's <b>tags</b> are a comma-separated list of tags that helps users find your flow more easily.
                                                    </p>
                                                </div>
                                                <div className="col-9">
                                                    <Label className="publish-label">Tags</Label>
                                                    {this.state.tags.length > 0 ? 
                                                        <div className="mb-3">
                                                            {this.state.tags.map((tag, i) => 
                                                            <span key={i} className="publish-tag mr-2">
                                                                {tag} <i className="fal fa-times ml-1" onClick={() => {this.handleDeleteTag(i)}}></i>
                                                            </span>)}
                                                        </div>
                                                        :
                                                        null
                                                    }
                                                    {
                                                        this.state.failed_tag_add?
                                                        <div className="alert alert-danger pt-1 pb-1 mt-2" role="alert">
                                                            You can have 3 tags at most.
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
                                    </div>
                                </div>

                                {/* <div className="big-settings-alignment-div">
                                    <div className="mb-4 mt-5"><b>Flow Variables</b></div>
                                    <div className="big-settings-content">
                                        <div className="row mb-4">
                                            <div className="col-3 publish-info">
                                                <p className="mb-0 helper-text"><b>Input variables</b> are the variables that will be available for input mapping when users use your flow.</p>
                                            </div>
                                            <div className="col-9">
                                                <Label className="publish-label">Input Variables</Label>
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
                                            <div className="col-3 publish-info">
                                                <p className="mb-0 helper-text"><b>Output variables</b> are the variables that will be available for output mapping when users use your flow.</p>
                                            </div>
                                            <div className="col-9">
                                                <Label className="publish-label">Output Variables</Label>
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
                                    </div>
                                </div> */}
                            </Form>
                            {!this.state.in_review &&
                            <div className="text-center">
                                <button variant="contained" className="purple-btn" onClick={this.toggleConfirmSubmission}>
                                    Submit Flow
                                </button>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    confirmModal: state.modal.confirmModal,
    skill_id: state.skills.skill.skill_id,
    project_id: state.skills.skill.project_id
})

const mapDispatchToProps = dispatch => {
    return {
        setConfirm: (confirm) => dispatch(setConfirm(confirm)),
        clearModal: () => dispatch(clearModal()),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PublishMarket);
