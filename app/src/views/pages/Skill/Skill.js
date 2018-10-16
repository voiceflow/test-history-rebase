import React, { Component } from 'react';

import axios from 'axios';

import { Button, Form, FormGroup, Label, Input, Modal, ModalBody, Alert } from 'reactstrap';
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

import AuthenticationService from './../../../services/Authentication';

import categories from './../../../services/Categories';

const stage_title = [
    "Login Developer with Amazon",
    "Verifying",
    "Privacy & Compliance"
]

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
        this.save = this.save.bind(this);
        this.onRadio = this.onRadio.bind(this);
    }

    componentWillMount() {
        AuthenticationService.AmazonAccessToken(token => {
            this.setState({
                stage: (token === null) ? 0 : 2
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
            amzn_id: s.amzn_id,
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
        if(this.state.stage === 1){
            this.setState({
                publish: !this.state.publish,
                stage: 0
            });
        }else{
            this.setState({
                publish: !this.state.publish
            });
        }
    }

    render() {

        let compliance = [{
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
                return <Paper className="p-3 my-3" key={i}>
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
                </Paper>
            })

        let content;

        if(this.state.stage === 0 || this.state.stage === -1){
            content = <div>
                {this.state.stage === -1 ? <Alert color="danger">Login With Amazon Failed</Alert> : null}
                <AmazonLogin
                updateLogin={(stage) => this.setState({stage: stage})}
                />
            </div>
        }else if(this.state.stage === 1){
            content = <h1><i className="fas fa-sync-alt fa-spin"/></h1>
        }else if(this.state.stage === 2){
            content = <div>
                {compliance}
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
                <Button color="primary" onClick={this.togglePublish} block>Submit To Alexa</Button>
            </div>
        }

        if(!this.state.loaded) return null;

        return (
            <div className='Window skill'>
                <div className="subheader">
                    <div className="container space-between">
                        <span className="subheader-title">Publish Skill Settings</span>
                        <div className="subheader-right">
                            <Button color="primary" className="mr-1" onClick={this.save}>Save {this.state.saved ? '':'*'}</Button>
                            <Button color="success" onClick={() => this.setState({publish: true})}>Publish</Button>
                        </div>
                    </div>
                </div>

                <Modal isOpen={!!this.state.publish} toggle={this.togglePublish} className={this.props.className} centered size="lg">
                    <ModalBody>
                        <div className="d-flex justify-content-between">
                            <b>{stage_title[this.state.stage]}</b> <button type="button" className="close" onClick={this.togglePublish}>×</button>
                        </div>
                        {content}
                    </ModalBody>
                </Modal>

                <ErrorModal error={this.state.error} dismiss={()=>this.setState({error: null})}/>

                <div className='container'>
                    <h1 className='display-5'>
                        <b>{this.state.name}</b>
                    </h1>
                    <small>Created {moment(this.state.created).fromNow()}</small>
                    <hr/>
                     <Form>
                        <FormGroup>
                          <Label>Skill Name *</Label>
                          <Input type="text" name="name" placeholder="Skill Name" value={this.state.name} onChange={this.handleChange} />
                        </FormGroup>
                        <div className="d-flex mb-4">
                            <div>
                                <Label>Small Icon *</Label>
                                <Image 
                                    className='icon-image small-icon'
                                    image={this.state.small_icon} 
                                    update={(url) => this.setState({small_icon: url})}/>
                            </div>
                            <div className="pl-3">
                                <Label>Large Icon *</Label>
                                <Image 
                                    className='icon-image large-icon'
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
                                max={5}
                                update={(list) => this.setState({invocations: list, saved: false})}
                                placeholder={"Alexa, open/start/turn on " + this.state.name}
                                add={<span><i className="fas fa-plus"/> Add Invocation</span>}
                           />
                        </FormGroup>
                        <hr/>
                        <FormGroup>
                          <Label>Keywords (Search Tags) <small>optional</small></Label>
                          <Input type="text" name="keywords" placeholder="Keywords (Seperated By Commas) e.g. Game, Space, Adventure" value={this.state.summary} onChange={this.handleChange} />
                        </FormGroup>
                      </Form>
                </div>
            </div>
        );
    }
}

export default Skill;
