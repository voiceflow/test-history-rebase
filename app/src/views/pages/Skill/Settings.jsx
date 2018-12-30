import React, { Component } from 'react'
import { Input, Alert, Button, FormGroup, Label } from 'reactstrap'
import Switch from '@material-ui/core/Switch'
import axios from 'axios'
import update from 'immutability-helper'
import Prompt from './Prompt'
import {clone} from 'lodash'

const TABS = ['basic', 'advanced']

class Settings extends Component {
    constructor(props) {
        super(props)

        this.state = {
            tab: 'basic',
            skill: null,
            saving: false,
            hide_resume: true
        }

        this.modalContent = this.modalContent.bind(this)
        this.switchTab = this.switchTab.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.saveSettings = this.saveSettings.bind(this)
        this.confirmDelete = this.confirmDelete.bind(this)
        this.toggleSwitch = this.toggleSwitch.bind(this)
        this.onDelete = this.onDelete.bind(this)
    }

    static getDerivedStateFromProps(props, state) {
        if(!state.skill){
            let hidden = false
            if(!props.skill.error_prompt){
                props.skill.error_prompt = {
                    voice: 'Alexa',
                    content: ''
                }
            }
            if(!props.skill.resume_prompt){
                hidden = true
                props.skill.resume_prompt = {
                    voice: 'Alexa',
                    content: ''
                }
            }
            return {
                skill: {
                    name: props.skill.name,
                    restart: props.skill.restart,
                    error_prompt: props.skill.error_prompt,
                    resume_prompt: props.skill.resume_prompt
                },
                hide_resume: hidden
            }
        }else{
            return null
        }
    }

    toggleSwitch(e) {
        this.setState({
            skill: update(this.state.skill, {
                [e.target.name]: {$set: !this.state.skill[e.target.name]}
            })
        })
    }

    confirmDelete() {
        this.props.onConfirm({
            warning: true,
            text: <Alert color="danger" className="mb-0">WARNING: This action can not be undone, <i>{this.props.skill.name}</i> and all flows can not be recovered</Alert>,
            confirm: this.onDelete
        })
    }

    onDelete(){
        axios.delete(`/skill/${this.props.skill.skill_id}`)
        .then(() => {
            this.props.history.push('/dashboard');
        })
        .catch(err => {
            console.log(err)
            this.props.onError('Error Deleting Skill')
        })
    }

    saveSettings() {
        let skill = clone(this.state.skill)
        if(this.state.hide_resume || !this.state.skill.resume_prompt.content){
            skill.resume_prompt = null
        }
        if(!this.state.skill.error_prompt.content){
            skill.error_prompt = null
        }

        this.setState({saving: true})
        axios.patch(`/skill/${this.props.skill.skill_id}?settings=1`, this.state.skill)
        .then(() => {
            this.props.updateSkill({...this.props.skill, ...skill})
            this.setState({saving: false, skill: null})
        })
        .catch(err => {
            this.setState({saving: false})
            this.props.onError('Settings Save Error')
        })
    }

    handleUpdate(e) {
        this.setState({
            skill: update(this.state.skill, {
                [e.target.name]: {$set: e.target.value}
            })
        })
    }

    switchTab(tab){
        if(tab !== this.state.tab){
            this.setState({
                tab: tab
            })
        }
    }

    modalContent(){
        if(!this.state.skill){
            return null
        }

        switch(this.state.tab){
            case 'advanced':
                return <React.Fragment>
                    <FormGroup>
                        <Label>Error Prompt</Label>
                        <div className="helper-text mb-2">What to say if the skill encounters an unexpected error</div>
                        <Prompt
                            placeholder="Sorry, this skill has encountered an error"
                            voice={this.state.skill.error_prompt.voice}
                            content={this.state.skill.error_prompt.content}
                            updatePrompt={(prompt) => this.setState({skill: update(this.state.skill, {
                                error_prompt: {$merge: prompt}
                            })})}
                        />
                        <hr/>
                        <Label>Delete Project</Label>
                        <Alert color="danger between">
                            <span>WARNING: This action can not be undone</span><br/>
                            <Button color="danger" onClick={this.confirmDelete}>Delete Skill</Button>
                        </Alert>
                    </FormGroup>
                </React.Fragment>
            default:
                return <React.Fragment>
                    <FormGroup>
                        <Label>Project Name</Label>
                        <Input name="name" value={this.state.skill.name} onChange={this.handleUpdate}/>
                    </FormGroup>
                    <FormGroup>
                        <Label className="mb-0">Restart Every Session</Label>
                        <div className="helper-text">{
                            this.state.skill.restart ?
                            'The project will restart from the beginning every time the user starts a session' :
                            'The project will resume from the last block the user was on before quitting'
                        }</div>
                        <div className="mb-2">
                            <Switch
                                name="restart"
                                checked={this.state.skill.restart}
                                onChange={this.toggleSwitch}
                                color="primary"
                            />
                            <b>{this.state.skill.restart ? 'ON': 'OFF'}</b>
                        </div>
                        {!this.state.skill.restart && <React.Fragment>
                                <Label>Resume Prompt 
                                </Label>
                                <div className="helper-text mb-2">Give the user a YES/NO prompt whether to resume</div>
                                <div className="mb-2">
                                    <Switch
                                        name="restart"
                                        checked={!this.state.hide_resume}
                                        onChange={()=>this.setState({hide_resume: !this.state.hide_resume})}
                                        color="primary"
                                    />
                                    <b>{this.state.hide_resume ? 'OFF' : 'ON'}</b>
                                </div>
                                {!this.state.hide_resume && <Prompt
                                    placeholder="Would you like to resume your current story, yes or no?"
                                    voice={this.state.skill.resume_prompt.voice}
                                    content={this.state.skill.resume_prompt.content}
                                    updatePrompt={(prompt) => this.setState({skill: update(this.state.skill, {
                                        resume_prompt: {$merge: prompt}
                                    })})}
                                />}
                                <hr/>
                            </React.Fragment>
                        }
                    </FormGroup>
                </React.Fragment>
        }
    }

    render(){
        let different = false
        // check to make sure there are actual differences before making a server call
        if(this.state.skill){
            for (var key in this.state.skill) {
                if(this.state.skill[key] !== this.props.skill[key]){
                    different = true
                }
            }
        }

        return <div id="business">
            <div className="sidebar-nav">
                {TABS.map((tab, i) => {
                    if(this.state.tab === tab){
                        return <div key={i} className="nav-item active">
                            {tab}
                        </div>
                    }else{
                        return <div key={i} onClick={() => this.switchTab(tab)} className="nav-item">
                            {tab}
                        </div>
                    }
                })}
            </div>
            <div className="content">
                <Button color="primary" style={{minWidth: 150}} onClick={different ? this.saveSettings : null}>
                    {this.state.saving ? <span className="loader"/> : <React.Fragment>{different && '*'} Save Settings</React.Fragment>}
                </Button>
                <hr/>
                {this.modalContent()}
            </div>
        </div>
    }
}

export default Settings