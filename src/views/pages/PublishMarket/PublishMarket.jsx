import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormGroup, Label, Input, Form } from 'reactstrap'
import MUIButton from '@material-ui/core/Button'
import Textarea from 'react-textarea-autosize'

import axios from 'axios'
import '../Skill/Skill.css'
import './PublishMarket.css'
import types from './../../../services/Types'
import { setConfirm, clearModal } from 'actions/modalActions'
import Select from 'react-select'
import { TAGS } from './../Marketplace/tags.js'

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
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.handleTagsChange = this.handleTagsChange.bind(this)
    }

	handleTypeSelection(value) {
		this.setState({
            saved: false,
            type: value
        });
	}

    handleTagsChange(tags){
        if(tags.length < 4){
            this.setState({
                tags: tags
            })
        }
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

            // Format tags
            res.data.tags = res.data.tags.map((curr_tag) => {
                return TAGS.find((tag) => {
                    return tag.value === curr_tag
                })
            }).filter((curr_tag) =>  {
                if(curr_tag){
                    return curr_tag
                }
            })

    		this.setState({
    			...res.data
            })
    	})
    	.catch(res => {
    		// Non-existant keep default vals
    	})

    	axios.get('/marketplace/cert/status/' + this.props.project_id)
    	.then(res => {
    		this.setState({
    			in_review: res.data
    		})
    	})
    	.catch(res => {
    	})
    }

    save = () => new Promise(async (resolve, reject) => {
        const s = this.state
        // const type = (s.type && s.type.value ? s.type.value : null);
        const type = 'FLOW'
        try{
            let tags = s.tags.map((curr_tag) => {
                let found_tag = TAGS.find((tag) => {
                    return tag.value === curr_tag.value
                })

                if(found_tag){
                    return found_tag.value
                }
            }).filter((tag) => {
                if(tag){
                    return tag
                }
            })

            await axios.patch('/marketplace/cert/' + this.props.project_id, {
                title: s.title,
                descr: s.descr,
                creator_id: this.props.user.id,
                tags: JSON.stringify(tags),
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
                                    <div className="mb-4 mt-5"><b>Basic Flow Info</b></div>
                                    <div className="big-settings-content">
                                        <FormGroup>
                                            <div className="row">
                                                <div className="col-3 publish-info">
                                                    <p className="mb-0 helper-text"><b>Title</b> is what we display for your flow on the Marketplace (max 20 characters).</p>
                                                </div>
                                                <div className="col-9">
                                                    <Label className="publish-label">Title *</Label>
                                                    <Input className="form-bg" type="text" name="title" placeholder="Onboarding" value={this.state.title} disabled={this.state.in_review} onChange={this.handleChange} maxLength={20}/>
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
                                                        <b>Short Description</b> One sentence summary of your flow that shows on its card in the Marketplace (max 20 characters). 
                                                    </p>
                                                </div>
                                                <div className="col-9">
                                                    <Label className="publish-label">Short Description *</Label>
                                                    <Input className="form-bg" type="text" name="title" placeholder="This flow fixes all your problems" value={this.state.title} disabled={this.state.in_review} onChange={this.handleChange} maxLength={20}/>
                                                </div>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="row">
                                                <div className="col-3 publish-info">
                                                    <p className="mb-0 helper-text">
                                                        <b>Detailed Description</b> is an in-depth overview of your flow. If you're using variables, writing a
                                                        detailed description is essential for your users' understanding. 
                                                    </p>
                                                </div>
                                                <div className="col-9">
                                                    <Label className="publish-label">Detailed Description</Label>
                                                    <Textarea
                                                        name="overview"
                                                        className="form-control"
                                                        disabled={this.state.in_review}
                                                        value={this.state.overview}
                                                        onChange={this.handleChange}
                                                        minRows={3}
                                                        placeholder="Detailed Description"
                                                    />
                                                </div>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="row">
                                                <div className="col-3 publish-info">
                                                    <p className="mb-0 helper-text">
                                                        Your flow's <b>tags</b> help users find your flow more easily based on their usage.
                                                    </p>
                                                </div>
                                                <div className="col-9">
                                                    <Label className="publish-label">Tags</Label>
                                                    <Select
                                                        classNamePrefix="variable-box"
                                                        className="map-box"
                                                        isMulti={true}
                                                        onChange={this.handleTagsChange}
                                                        placeholder='Tags'
                                                        options={TAGS}
                                                        value={this.state.tags}
                                                    />
                                                </div>
                                            </div>
                                        </FormGroup>
                                    </div>
                                </div>
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
