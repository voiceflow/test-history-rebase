import React, { Component } from 'react'
import { Input, Alert, ButtonGroup, Button, FormGroup, Label, Table } from 'reactstrap'
import Switch from '@material-ui/core/Switch'
import axios from 'axios'
import update from 'immutability-helper'
import Prompt from './Prompt'
import moment from 'moment'
import CanFulfill from './Canfulfill'
import { clone } from 'lodash'
import _ from 'lodash'
import ErrorModal from '../../../views/components/Modals/ErrorModal'

import { intentHasSlots } from '../../../util'

import { BUILT_IN_INTENTS } from '../Canvas/Constants'

const BUILT_INS = BUILT_IN_INTENTS.map(intent => {
    return {
        built_in: true,
        name: intent.name,
        key: intent.name,
        inputs: [{
            text: '',
            slots: intent.slots
        }]
    }
})

const TABS = ['basic', 'advanced', 'discovery', 'backups']

class Settings extends Component {
    constructor(props) {
        super(props)

        this.state = {
            skill: null,
            saving: false,
            hide_resume: true,
            add_intent: null
        }

        this.modalContent = this.modalContent.bind(this)
        this.switchTab = this.switchTab.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.saveSettings = this.saveSettings.bind(this)
        this.confirmDelete = this.confirmDelete.bind(this)
        this.toggleSwitch = this.toggleSwitch.bind(this)
        this.onDelete = this.onDelete.bind(this)
        this.confirmRestore = this.confirmRestore.bind(this)
        this.onError = this.onError.bind(this)
        this.onUpdate = this.onUpdate.bind(this)
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
            return {
                skill: {
                    name: props.skill.name,
                    restart: props.skill.restart,
                    error_prompt: props.skill.error_prompt,
                    resume_prompt: props.skill.resume_prompt,
                    intents: props.skill.intents,
                    slots: props.skill.slots,
                    fulfillment: _.cloneDeep(props.skill.fulfillment)
                },
                hide_resume: hidden
            }
        } else {
            return null
        }
    }

    toggleSwitch(e) {
        this.setState({
            skill: update(this.state.skill, {
                [e.target.name]: { $set: !this.state.skill[e.target.name] }
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

    saveSettings() {
        let skill = clone(this.state.skill)
        if (this.state.hide_resume || !this.state.skill.resume_prompt.content) {
            skill.resume_prompt = null
        }
        if (!this.state.skill.error_prompt.content) {
            skill.error_prompt = null
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

    handleUpdate(e) {
        this.setState({
            skill: update(this.state.skill, {
                [e.target.name]: { $set: e.target.value }
            })
        })
    }

    onUpdate() {
        this.forceUpdate()
    }

    switchTab(tab) {
        if (tab !== this.props.page) {
            this.props.history.push(`/settings/${this.props.skill.skill_id}/${tab}`)
        }
    }

    confirmRestore(skill_id, canonical_skill_id) {
        this.props.onConfirm({
            warning: true,
            text: <Alert color="danger" className="mb-0">WARNING: This action can not be undone, will delete all your current work since your last backup, and will not change your skill's Amazon endpoint. </Alert>,
            confirm: this.props.onSwapVersions,
            params: [skill_id, canonical_skill_id]
        })
    }

    fulfillmentButtons(intents_sorted) {
        return intents_sorted.map((intent, i) => {
            if (this.state.skill.fulfillment[intent.key]) {
                return <button className="btn btn-clear btn-shadow w-100 my-2 d-flex space-between" key={i} onClick={() => {
                    this.props.history.push(`/settings/${this.props.skill.skill_id}/discovery/canfulfill/${intent.key}`)
                }} disabled={!intentHasSlots(intent)}>
                    <span className="slot-fulfillment"><i className="fas fa-comment-alt-check mr-2"></i>{intent.name}</span>
                </button>
            }
            return null
        })
    }

    onError(error_message) {
        this.setState({
            error: error_message
        })
    }

    modalContent(fullfillment_intent_key) {
        if (!this.state.skill) {
            return null
        }

        const intents_sorted = _.orderBy(this.state.skill.intents.concat(BUILT_INS), ['name'], ['asc'])
        const fulfillment_intent = _.find(intents_sorted, { key: fullfillment_intent_key })

        switch (this.props.page) {
            case 'discovery':
                return <React.Fragment>
                    <FormGroup>
                        <Label>CanFulfill Intent</Label>
                        <div className="helper-text mb-2">Set the slot fulfillment values that your skill is able to understand</div>
                        <hr />
                        {!fullfillment_intent_key && <div className="selected-intent-label">{Object.keys(this.state.skill.fulfillment).length !== 0 ? 'Select an Intent Below to Customize Slot Fulfillment' : 'To add a CanFulfillIntent Handle, add an Intent Block in your Root Flow and enable the "CanFulfillIntent" toggle'}</div>
                        }
                        {!fullfillment_intent_key && this.fulfillmentButtons(intents_sorted)}
                        {fullfillment_intent_key &&
                            <CanFulfill
                                slots={this.state.skill.slots}
                                fulfillment={this.state.skill.fulfillment}
                                selected_intent={fulfillment_intent}
                                history={this.props.history}
                                skill_id={this.props.skill.skill_id}
                                onError={this.onError}
                                onUpdate={this.onUpdate}
                            />}
                    </FormGroup>
                </React.Fragment>
            case 'advanced':
                return <React.Fragment>
                    <FormGroup>
                        <Label>Error Prompt</Label>
                        <div className="helper-text mb-2">What to say if the skill encounters an unexpected error</div>
                        <Prompt
                            placeholder="Sorry, this skill has encountered an error"
                            voice={this.state.skill.error_prompt.voice}
                            content={this.state.skill.error_prompt.content}
                            updatePrompt={(prompt) => this.setState({
                                skill: update(this.state.skill, {
                                    error_prompt: { $merge: prompt }
                                })
                            })}
                        />
                        <hr />
                        <Label>Delete Project</Label>
                        <Alert color="danger between">
                            <span>WARNING: This action can not be undone</span><br />
                            <Button color="danger" onClick={this.confirmDelete}>Delete Skill</Button>
                        </Alert>
                    </FormGroup>
                </React.Fragment>
            case 'backups':
            return <React.Fragment>
                <FormGroup>
                    <Label>Backups</Label>
                    <div className="helper-text mb-2">Restore your skill to previous versions, saved when you upload your skill to Alexa.</div>
                    {window.user_detail.admin > 10?
                        <Table>
                            <thead>
                                <tr>
                                    <th>Saved</th>
                                    <th>Blocks</th>
                                    <th>Preview</th>
                                    <th>Restore</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.versions.map((version, i) => {
                                    return <tr key={i}>
                                        <td>{moment(version.created).fromNow()}</td>
                                        <td>199</td>
                                        <td>{version.skill_id}</td>
                                        <td>
                                            {/* <Button className='purple-btn' onClick={() => {this.props.onSwapVersions(version.skill_id, version.canonical_skill_id)}}>Restore</Button> */}
                                            <Button className='purple-btn' onClick={() => this.confirmRestore(version.skill_id, version.canonical_skill_id)}>Restore</Button>
                                        </td>
                                    </tr>
                                })}
                            </tbody>

                        </Table>
                        :
                        <div>Don't @ me poor guy</div>
                    }
                </FormGroup>
            </React.Fragment>
            default:
                return <React.Fragment>
                    <FormGroup>
                        <Label>Project Name</Label>
                        <Input className="form-bg" name="name" value={this.state.skill.name} onChange={this.handleUpdate}/>
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
                            <b>{this.state.skill.restart ? 'ON' : 'OFF'}</b>
                        </div>
                        {!this.state.skill.restart && <React.Fragment>
                            <Label>Resume Prompt
                                </Label>
                            <div className="helper-text mb-2">Give the user a YES/NO prompt whether to resume</div>
                            <div className="mb-2">
                                <Switch
                                    name="restart"
                                    checked={!this.state.hide_resume}
                                    onChange={() => this.setState({ hide_resume: !this.state.hide_resume })}
                                    color="primary"
                                />
                                <b>{this.state.hide_resume ? 'OFF' : 'ON'}</b>
                            </div>
                            {!this.state.hide_resume && <Prompt
                                placeholder="Would you like to resume your current story, yes or no?"
                                voice={this.state.skill.resume_prompt.voice}
                                content={this.state.skill.resume_prompt.content}
                                updatePrompt={(prompt) => this.setState({
                                    skill: update(this.state.skill, {
                                        resume_prompt: { $merge: prompt }
                                    })
                                })}
                            />}
                        </React.Fragment>
                        }
                    </FormGroup>
                </React.Fragment>
        }
    }

    render() {
        let different = false
        let fullfillment_intent_key
        // check to make sure there are actual differences before making a server call
        if (this.state.skill) {
            for (var key in this.state.skill) {
                if (!_.isEqual(this.state.skill[key], this.props.skill[key])) {
                    different = true
                }
            }
        }

        fullfillment_intent_key = this.props.computedMatch.params ? this.props.computedMatch.params.id : null;

        return <div id="settings">
            <div className="nav-bar-top">
                <ButtonGroup className="toggle-group mb-2 toggle-group-settings mt-5">
                    {TABS.map(tab => {
                        return <Button
                            key={tab}
                            onClick={() => this.switchTab(tab)}
                            outline={this.props.page !== tab}
                            disabled={this.props.page === tab}>
                            {tab}
                        </Button>
                    })}
                </ButtonGroup>
            </div>
            <ErrorModal error={this.state.error} dismiss={() => this.setState({ error: null })} />
            <div className="settings-content clearfix">
                {this.modalContent(fullfillment_intent_key)}
                <hr />
                {this.props.page !== 'backups' &&
                    <Button className='purple-btn' style={{minWidth: 150}} onClick={different ? this.saveSettings : null}>
                        {this.state.saving ? <span className="loader"/> : <React.Fragment>{different && '*'} Save Settings</React.Fragment>}
                    </Button>
                }
                {fullfillment_intent_key && <Button className='purple-btn back-btn save-btn mr-2' style={{ minWidth: 150 }} onClick={() => {
                    this.props.history.push(`/settings/${this.props.skill.skill_id}/discovery`)
                }}><React.Fragment> Back</React.Fragment>
                </Button>}
            </div>
        </div>
    }
}

export default Settings
