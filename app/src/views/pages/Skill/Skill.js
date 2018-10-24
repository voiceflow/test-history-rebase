import React, { Component } from 'react';

import axios from 'axios';

import { Button, Form, FormGroup, Label, Input, Modal, ModalBody, Alert } from 'reactstrap';
import MUIButton from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import MUFormGroup from '@material-ui/core/FormGroup';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Textarea from 'react-textarea-autosize';
import moment from 'moment';
import Image from './../../components/Uploads/Image';
import Multiple from './../../components/Forms/Multiple';
import ErrorModal from './../../components/Modals/ErrorModal';
import AmazonLogin from './../../components/Forms/AmazonLogin';
import Select from 'react-select';
import './Skill.css';
import {Link} from 'react-router-dom'

import AuthenticationService from './../../../services/Authentication';

import categories from './../../../services/Categories';

const stage_title = {
    "-1": "Login Failed",
    "0": "Login Developer with Amazon",
    "1": "Verifying",
    "2": "Privacy & Compliance",
    "3": "Rendering",
    "4": "Publishing",
    "5": "Developer Account",
    "6": "Checking Vendor",
    "10": "Awaiting Review"
}

class Skill extends Component {

    constructor(props) {
        super(props);

        if(this.props.computedMatch && this.props.computedMatch.params.id){
            this.state = {
                loaded: false,
                dropdown: false,
                saved: true,
                skill_id: this.props.computedMatch.params.id,
                error: null,
                stage: 1,
                publish: false
            }
        } else {
            this.props.history.push('/dashboard');
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.toggle = this.toggle.bind(this);
        this.togglePublish = this.togglePublish.bind(this);
        this.closePublish = this.closePublish.bind(this);
        this.save = this.save.bind(this);
        this.onRadio = this.onRadio.bind(this);
        this.onPublish = this.onPublish.bind(this);
        this.checkVendor = this.checkVendor.bind(this);
    }

    componentWillMount() {
        // token ? 2 : 0
        AuthenticationService.AmazonAccessToken(token => {
            this.setState({
                stage: token ? 2 : 0
            });
        })
    }

    componentDidMount() {
        if(this.state.skill_id){
            axios.get('/skill/' + this.state.skill_id + '?verbose=1')
            .then(res => {
                if(res.data.category){
                    for(let option of categories){
                        if(option.value === res.data.category){
                            res.data.category = option;
                            break;
                        }
                    };
                }

                if(res.data.invocations && res.data.invocations.value){
                    res.data.invocations = res.data.invocations.value;
                }

                if(!Array.isArray(res.data.invocations) || res.data.invocations.length === 0){
                    res.data.invocations = ['']
                }

                this.setState({
                    loaded: true, 
                    ...res.data
                });
            })
            .catch(err => {
                console.log(err);
            });
        }
    }

    onRadio(type, value) {
        this.setState({
            [type]: value,
            saved: false
        })
    }

    onPublish(){
        this.save(true, ()=>{
            this.setState({stage: 3});

            axios.post(`/diagram/${this.state.diagram}/${this.state.skill_id}/publish`)
            .then(res => {
                this.setState({stage: 4});

                axios.post(`/skill/${this.state.skill_id}/publish`)
                .then(res => {
                    this.setState({
                        stage: 10,
                        publish: false
                    });
                })
                .catch(err => {
                    if(err.response.status === 404){
                        // No Vendor ID/Amazon Developer Account
                        this.setState({
                            stage: 5
                        });
                    }else{
                        this.setState({
                            publish: false,
                            stage: 2,
                            error: 'Publishing Error'
                        });
                    }
                })
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    publish: false,
                    stage: 2,
                    error: 'Rendering Error'
                })
            })
        });
    }

    checkVendor(){
        this.setState({stage: 6});

        axios.get('/session/vendor')
        .then(() => {
            this.setState({stage: 2});
        })
        .catch(err => {
            console.error(err);
            this.setState({stage: 5});
        });
    }

    save(publish=false, cb){

        const s = this.state;
        const category = (s.category && s.category.value ? s.category.value : null);

        let store;

        if(publish === true){
            store = {
                purchase: s.purchase,
                personal: s.personal,
                copa: s.copa,
                ads: s.ads,
                export: s.export,
                instructions: s.instructions
            }
        }

        axios.patch(('/skill/' + this.state.skill_id + (publish === true ? '?publish=true' : '')), {
            name: s.name,
            inv_name: s.inv_name,
            summary: s.summary,
            description: s.description,
            keywords: s.keywords,
            invocations: s.invocations,
            small_icon: s.small_icon,
            large_icon: s.large_icon,
            category: category,
            ...store
        })
        .then(res => {
            this.setState({
                saved: true
            });
            if(typeof(cb) === 'function') cb();
        })
        .catch(err => {
            console.log(err);
            this.setState({
                error: 'Save Error, updates not saved'
            });
        });
    }

    handleChange(event){
        this.setState({
            saved: false,
            [event.target.name]: event.target.value
        });
    }

    handleSelection(value){
        this.setState({
            saved: false,
            category: value
        });
    }

    toggle() {
        this.setState({
          dropdown: !this.state.dropdown
        });
    }

    togglePublish() {
        this.setState({
            publish: !this.state.publish
        });
    }

    closePublish() {
        if(this.state.stage === 1){
            this.setState({
                stage: 0
            });
        }
    }

    render() {
        // Success Screen
        if(this.state.stage === 10){
            return <div className="super-center h-100">
                <div className="success-page d-flex">
                    <div className="success-text">
                        <h1>Congrats! <span role="img" aria-label="happy">☺️</span></h1>
                        <p className="text-muted">
                            Your skill has been successfully submitted for review to the Amazon Skill store. You will be updated on the status of your skill via email.
                        </p>
                        <Link to="/dashboard"><MUIButton variant="contained" className="purple-btn">Dashboard</MUIButton></Link>
                        <MUIButton variant="contained" className="white-btn ml-3" onClick={() => this.setState({stage: 2})}>Return to Project</MUIButton>
                    </div>
                    <img src="/images/success.svg" alt="success"/>
                </div>
            </div>
        }

        let content;
        if(this.state.stage === 0 || this.state.stage === -1){
            content = <div>
                {this.state.stage === -1 ? 
                    <Alert color="danger">Login With Amazon Failed - Try Again.</Alert> : null
                }
                <AmazonLogin
                    updateLogin={(stage) => {
                        if(stage === 2){
                            this.checkVendor();
                        }else{
                            this.setState({stage: stage});
                        }
                    }}
                />
            </div>
        }else if(this.state.stage === 1 || 
            this.state.stage === 3 ||
            this.state.stage === 4 ||
            this.state.stage === 6){
            content = <div>
                    <h1><i className="fas fa-sync-alt fa-spin"/></h1>
                    <p className="loading">{stage_title[this.state.stage]}</p>
            </div>
        }else if(this.state.stage === 2){
            content = <div className="MUIform">
                {[{
                    value: 'purchase',
                    text: 'Does this skill allow users to make purchases or spend real money?'
                }, {
                    value: 'personal',
                    text: 'Does this Alexa skill collect users\' personal information?'
                }, {
                    value: 'copa',
                    text: 'Is this skill directed to or does it target children under the age of 13?'
                }, {
                    value: 'ads',
                    text: 'Does this skill contain advertising?'
                }, {
                    value: 'export',
                    text: "This Alexa skill may be imported to and exported from the United States and all other countries and regions in which Amazon operates their program or in which you've authorized sales to end users (without the need for us to obtain any license or clearance or take any other action) and is in full compliance with all applicable laws and regulations governing imports and exports, including those applicable to software that makes use of encryption technology.",
                    yes: 'I certify',
                    no: 'I do not certify'
                }].map((form, i) => {
                    return (
                        <Paper className="p-3 my-3" key={i}>
                            {form.text}
                            <MUFormGroup row>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                          checked={this.state[form.value]}
                                          onChange={() => this.onRadio(form.value, true)}
                                          color="primary"
                                        />
                                    }
                                  label={form.yes ? form.yes : "Yes"}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                          checked={!this.state[form.value]}
                                          onChange={() => this.onRadio(form.value, false)}
                                          color="primary"
                                        />
                                    }
                                    label={form.no ? form.no : "No"}
                                />
                            </MUFormGroup>
                        </Paper>)
                })}
                <Paper className="p-3 my-3">
                   <Label>Testing Instructions</Label> 
                   <Textarea
                        name="instructions"
                        className="blank"
                        value={this.state.instructions}
                        onChange={this.handleChange}
                        minRows={3}
                        placeholder="Any Particular Testing Instructions for Amazon Approval Process"
                    />
                </Paper>
                <Button color="primary" onClick={this.onPublish} block>Submit To Alexa</Button>
            </div>
        }else if(this.state.stage === 5 || this.state.stage === 6){
            content = <div>
                Your Amazon Account needs to set up developer settings to Publish Skills
                <span className="text-muted text-center font-italic">
                    Press "Create your Amazon Developer account"<br/> 
                    and sign up with the same email as your Amazon Account.
                </span>
                <div className="my-3">
                    <a href="https://developer.amazon.com/login.html" className="btn btn-primary mr-2" target="_blank"  rel="noopener noreferrer">
                        Developer Sign Up
                    </a>
                    <Button color="info" onClick={this.checkVendor}>
                        <i className="fas fa-sync-alt"/> Check Again
                    </Button>
                </div>
            </div>
        }

        if(!this.state.loaded) return null;

        return (
            <div className='Window skill'>
                <div className="subheader">
                    <div className="container space-between">
                        <span className="subheader-title">
                            <b>Settings</b>
                            <div className="hr-label">
                                <small><i className="far fa-user mr-1"></i></small> {this.props.user.name}{' '}
                                <small><i className="far fa-chevron-right"/></small>{' '}
                                <span className="text-secondary">{this.state.name}</span>{' '}
                                <small> / created {moment(this.state.created).fromNow()}</small>
                            </div>
                        </span>
                        <div className="subheader-right">
                            <MUIButton variant="contained" className="white-btn mr-3" onClick={this.save}>Save Draft{this.state.saved ? '':'*'}</MUIButton>
                            <MUIButton variant="contained" className="purple-btn" onClick={() => this.setState({publish: true})}>Publish Skill <i className="fab fa-amazon ml-2"/></MUIButton>
                        </div>
                    </div>
                </div>

                <Modal 
                    isOpen={this.state.publish} 
                    toggle={this.togglePublish} 
                    className="stage_modal" 
                    centered 
                    size="lg"
                    onClosed={this.closePublish}>
                    <ModalBody>
                        <div className="d-flex justify-content-between">
                            <b>{stage_title[this.state.stage]}</b> <button type="button" className="close" onClick={this.togglePublish}>×</button>
                        </div>
                        <div className="modal-info">
                            {content}
                        </div>
                    </ModalBody>
                </Modal>

                <ErrorModal error={this.state.error} dismiss={()=>this.setState({error: null})}/>

                <div className='container mt-3'>
                     <Form>
                        <FormGroup>
                          <Label>Skill Display Name *</Label>
                          <Input type="text" name="name" placeholder="Storyflow - Interactive Story Adventures" value={this.state.name} onChange={this.handleChange} />
                        </FormGroup>
                        <FormGroup>
                          <Label>Invocation Name *</Label>
                          <Input type="text" name="inv_name" placeholder="Enter an invocation name that begins an interaction with your skill" value={this.state.inv_name} onChange={this.handleChange} />
                        </FormGroup>
                        <div className="d-flex mb-4">
                            <div>
                                <Label>Small Icon *</Label>
                                <Image 
                                    className='icon-image small-icon'
                                    path='/small_icon'
                                    image={this.state.small_icon} 
                                    update={(url) => this.setState({small_icon: url})}/>
                            </div>
                            <div className="pl-3">
                                <Label>Large Icon *</Label>
                                <Image 
                                    className='icon-image large-icon'
                                    path='/large_icon'
                                    image={this.state.large_icon} 
                                    update={(url) => this.setState({large_icon: url})}/>
                            </div>
                        </div>
                        <FormGroup>
                          <Label>Summary *</Label>
                          <Input type="text" name="summary" placeholder="One Sentence Skill Summary" value={this.state.summary} onChange={this.handleChange} />
                        </FormGroup>
                        <FormGroup>
                           <Label>Description *</Label> 
                           <Textarea
                                name="description"
                                className="form-control"
                                value={this.state.description}
                                onChange={this.handleChange}
                                minRows={3}
                                placeholder="Skill Description"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Category *</Label>
                            <Select
                                className="input-select"
                                name="category"
                                value={this.state.category}
                                onChange={this.handleSelection}
                                options={categories}
                            />
                        </FormGroup>
                        <FormGroup>
                           <Label>Skill Invocations *</Label>
                           <Multiple
                                list={this.state.invocations}
                                max={3}
                                prepend="Alexa,"
                                update={(list) => this.setState({invocations: list, saved: false})}
                                placeholder={"open/start/turn on " + this.state.name}
                                add={<span><i className="fas fa-plus"/> Add Invocation</span>}
                           />
                        </FormGroup>
                        <hr/>
                        <FormGroup>
                          <Label>Keywords (Search Tags) <small>optional</small></Label>
                          <Input type="text" name="keywords" placeholder="Keywords (Seperated By Commas) e.g. Game, Space, Adventure" value={this.state.keywords} onChange={this.handleChange} />
                        </FormGroup>
                      </Form>
                </div>
            </div>
        );
    }
}

export default Skill;
