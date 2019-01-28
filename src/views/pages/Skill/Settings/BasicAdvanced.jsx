import React, {Component} from 'react'
import _ from 'lodash'
import axios from 'axios'
import update from 'immutability-helper'
import {Alert, FormGroup, Label, Button, Input} from 'reactstrap'
import Switch from '@material-ui/core/Switch'
import Prompt from 'views/components/Uploads/Prompt'
import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/ext/language_tools';
class BasicAdvancedSettings extends Component{

    constructor(props){
        super(props)

        this.state = {
            skill: null,
            saving: false,
            hide_resume: true
        }

        this.requestPDF = this.requestPDF.bind(this)
        this.confirmDelete = this.confirmDelete.bind(this)
        this.onDelete = this.onDelete.bind(this)
        this.toggleSwitch = this.toggleSwitch.bind(this)
        this.saveSettings = this.saveSettings.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.renderSettings = this.renderSettings.bind(this)
        this.isDifferent = this.isDifferent.bind(this)
        this.getSaveButton = this.getSaveButton.bind(this)
        this.toggleRepeat = this.toggleRepeat.bind(this)
    }

    static getDerivedStateFromProps(props, state) {
        if (!state.skill) {
            let hidden = false
            if (!props.skill.error_prompt) {
                props.skill.error_prompt = {
                    voice: 'Alexa',
                    content: ''
                }
            }
            if (!props.skill.resume_prompt) {
                hidden = true
                props.skill.resume_prompt = {
                    voice: 'Alexa',
                    content: ''
                }
            }
            let skill = {
                name: props.skill.name,
                restart: props.skill.restart,
                error_prompt: props.skill.error_prompt,
                resume_prompt: props.skill.resume_prompt,
                intents: props.skill.intents,
                slots: props.skill.slots,
                repeat: props.skill.repeat ? props.skill.repeat : 0,
                alexa_events: props.skill.alexa_events ? props.skill.alexa_events : ''
            }
            return {
                skill: skill,
                baseline: _.clone(skill),
                hide_resume: hidden
            }
        } else {
            return null
        }
    }

    toggleRepeat(low, high) {
        let skill = this.state.skill
        if(skill.repeat > low){
            skill.repeat = low
        }else{
            skill.repeat = high
        }
        this.setState({skill: skill})
    }

    handleUpdate(e) {
        this.setState({
            skill: update(this.state.skill, {
                [e.target.name]: { $set: e.target.value }
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

    onDelete() {
        axios.delete(`/skill/${this.props.skill.skill_id}`)
            .then(() => {
                this.props.history.push('/dashboard');
            })
            .catch(err => {
                console.log(err)
                this.props.onError('Error Deleting Skill')
            })
    }
    
    toggleSwitch(e) {
        this.setState({
            skill: update(this.state.skill, {
                [e.target.name]: { $set: !this.state.skill[e.target.name] }
            })
        })
    }

    requestPDF(){
        if (_.isNull(localStorage.getItem('requestPDF'))){
          axios.post(`/requestPDF`, {
            skill: this.props.skill,
          })
          .then(() => {
            localStorage.setItem('requestPDF', true);
            this.props.onError('PDF will be sent to your email within 12 hours')
          })
          .catch(err => {
            this.props.onError('Failed to send')
          })

        } else {
          this.props.onError('Request already sent')
        }
    }

    saveSettings() {
        let skill = _.clone(this.state.skill)
        if (this.state.hide_resume || !this.state.skill.resume_prompt.content) {
            skill.resume_prompt = null
        }
        if (!this.state.skill.error_prompt.content) {
            skill.error_prompt = null
        }
        if(skill.alexa_events.trim()){
            try{
                JSON.parse(skill.alexa_events)
            }catch(err){
                this.props.onError('Invalid JSON For Skill Events: '+ err.message)
                return
            }
        }else{
            skill.alexa_events = null
        }

        this.setState({ saving: true })
        axios.patch(`/skill/${this.props.skill.skill_id}?settings=1`, skill)
        .then(() => {
            this.props.updateSkill({ ...this.props.skill, ...skill })
            this.setState({ saving: false, skill: null })
        })
        .catch(err => {
            this.setState({ saving: false })
            this.props.onError('Settings Save Error')
        })
    }

    isDifferent(keys){
        let different = false;
        if (this.state.skill && this.state.baseline) {
          _.forEach(keys, key => {
            if (this.state.skill[key] !== this.state.baseline[key]) {
              different = true;
            }
          })
        }
        return different;
    }

    getSaveButton(keys=_.keys(this.state.skill)){
        return <React.Fragment>
            {(this.props.page !== "backups" && this.isDifferent(keys)) && <div className="super-center">
                <hr />
                <button className="purple-btn" style={{ minWidth: 150 }} onClick={this.saveSettings}>
                    {this.state.saving ? <span className="loader" /> : <React.Fragment>
                        Save Settings
                                    </React.Fragment>}
                </button>
            </div>}
        </React.Fragment>
    }

    renderSettings(){
        let different
        // check to make sure there are actual differences before making a server call
        if (this.state.skill && this.state.baseline) {
            for (var key in this.state.skill) {
                if (this.state.skill[key] !== this.state.baseline[key]) {
                    different = true
                }
            }
        }
        switch(this.props.page){
            case 'advanced':
                // ADVANCED SETTINGS
                return <React.Fragment>
                    <div className="settings-content clearfix mt-4">
                      <FormGroup>
                        <Label>Error Prompt</Label>
                        <div className="helper-text mb-2">
                          What to say if the skill encounters an
                          unexpected error
                        </div>
                        <Prompt placeholder="Sorry, this skill has encountered an error" voice={this.state.skill.error_prompt.voice} content={this.state.skill.error_prompt.content} updatePrompt={prompt => this.setState(
                              {
                                skill: update(
                                  this.state.skill,
                                  {
                                    error_prompt: {
                                      $merge: prompt
                                    }
                                  }
                                )
                              }
                            )} />
                      </FormGroup>
                      {this.getSaveButton(["error_prompt"])}
                    </div>
                    <div className="settings-content clearfix">
                      <FormGroup>
                        {window.user_detail.admin >= 60 && <div className="mt-4">
                            <Label>
                              Skill Events (events: {"{object}"}
                              )
                            </Label>
                            <AceEditor name="datasource_editor" className="datasource_editor" mode="json" onChange={value => {
                                let skill = this.state.skill;
                                skill.alexa_events = value;
                                this.setState({ skill: skill });
                              }} fontSize={14} showPrintMargin={false} showGutter={true} highlightActiveLine={true} value={this.state.skill.alexa_events} editorProps={{ $blockScrolling: true }} setOptions={{ enableBasicAutocompletion: true, enableLiveAutocompletion: false, enableSnippets: false, showLineNumbers: true, tabSize: 2, useWorker: false }} />
                          </div>}
                      </FormGroup>
                      {this.getSaveButton(["alexa_events"])}
                    </div>
                    <div className="settings-content clearfix">
                      <FormGroup>
                        <Label>Delete Project</Label>
                        <Alert color="danger between">
                          <span>
                            This action can not be
                            undone
                          </span>
                          <br />
                          <Button color="danger" onClick={this.confirmDelete}>
                            Delete Skill
                          </Button>
                        </Alert>
                        <hr />
                      </FormGroup>
                    </div>
                  </React.Fragment>;
            default:
                // BASIC SETTINGS
                return <React.Fragment>
                    <div className="settings-content clearfix mt-4">
                      <FormGroup>
                        <Label>Project Name</Label>
                        <Input className="form-bg" name="name" value={this.state.skill.name} onChange={this.handleUpdate} />
                      </FormGroup>

                      <FormGroup>
                        <Label>Repeat</Label>
                        <div className="helper-text">
                          Users will be able to say repeat at
                          any choice/interaction and the dialog
                          will repeat
                        </div>
                        <Switch checked={this.state.skill.repeat > 0} onChange={() => this.toggleRepeat(0, 100)} color="primary" />
                        <b>
                          {this.state.skill.repeat > 0
                            ? "ON"
                            : "OFF"}
                        </b>
                        {this.state.skill.repeat > 0 && <div>
                            <Switch checked={this.state.skill.repeat > 1} onChange={() => this.toggleRepeat(1, 100)} color="primary" />
                            <b>Complete Repeat</b>
                            <div className="helper-text">
                              {this.state.skill.repeat > 1
                                ? "When the user asks to repeat, everything after the last choice/interaction block will repeat"
                                : "When the user asks to repeat, only the last speak block before the choice/interaction will be repeated"}
                            </div>
                          </div>}
                      </FormGroup>
                      {this.getSaveButton(['name', 'repeat'])}
                    </div>
                    <div className="settings-content clearfix">
                      <FormGroup>
                        <Label className="mb-0">
                          Restart Every Session
                        </Label>
                        <div className="helper-text">
                          {this.state.skill.restart
                            ? "The project will restart from the beginning every time the user starts a session"
                            : "The project will resume from the last block the user was on before quitting"}
                        </div>
                        <div className="mb-2">
                          <Switch name="restart" checked={this.state.skill.restart} onChange={this.toggleSwitch} color="primary" />
                          <b>
                            {this.state.skill.restart
                              ? "ON"
                              : "OFF"}
                          </b>
                        </div>
                        {!this.state.skill.restart && <React.Fragment>
                            <Label>Resume Prompt</Label>
                            <div className="helper-text mb-2">
                              Give the user a YES/NO prompt
                              whether to resume
                            </div>
                            <div className="mb-2">
                              <Switch name="restart" checked={!this.state.hide_resume} onChange={() => this.setState(
                                    {
                                      hide_resume: !this.state
                                        .hide_resume
                                    }
                                  )} color="primary" />
                              <b>
                                {this.state.hide_resume
                                  ? "OFF"
                                  : "ON"}
                              </b>
                            </div>
                            {!this.state.hide_resume && <Prompt placeholder="Would you like to resume your current story, yes or no?" voice={this.state.skill.resume_prompt.voice} content={this.state.skill.resume_prompt.content} updatePrompt={prompt => this.setState(
                                    {
                                      skill: update(
                                        this.state.skill,
                                        {
                                          resume_prompt: {
                                            $merge: prompt
                                          }
                                        }
                                      )
                                    }
                                  )} />}
                          </React.Fragment>}
                        {this.props.user.admin >= 30 && <FormGroup className="mt-4">
                            <Label>Generate PDF</Label>
                            <Button color="clear" onClick={this.requestPDF}>
                              Request for PDF &nbsp;
                              <i className="far fa-file-pdf" />
                            </Button>
                          </FormGroup>}
                      </FormGroup>
                        {this.getSaveButton(['restart', 'hide_resume', 'resume_prompt'])}
                    </div>
                  </React.Fragment>;
        }
    }

    render(){
        return <React.Fragment>
            {this.renderSettings()}
        </React.Fragment>
    }
}

export default BasicAdvancedSettings