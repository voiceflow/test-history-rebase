import React, { Component } from 'react'
import axios from 'axios'
import TemplateCard from './TemplateCard'
import LOCALE_MAP from './../../../services/LocaleMap'
import { Modal, Alert } from 'reactstrap'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import './Template.css'
import LightCanvas from './../Canvas/LightCanvas'
import MUIButton from '@material-ui/core/Button';
import { Spinner } from 'views/components/Spinner'

class Templates extends Component {
    constructor(props) {
        super(props)

        this.state = {
            stage: 0,
            loading: false,
            preview: false,
            templates: [],
            name: '',
            locales: ['en-US'],
            error: '',
            template: {},
            google: false,
            alexa: false
        }

        this.createSkill = this.createSkill.bind(this)
        this.previewTemplate = this.previewTemplate.bind(this)
        this.renderBody = this.renderBody.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveSettings = this.saveSettings.bind(this)
        this.onLocaleBtnClick = this.onLocaleBtnClick.bind(this)
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onLocaleBtnClick(locale) {
        let locales = this.state.locales;
        if (locales.includes(locale)) {
            if (locales.length > 1) {
                _.remove(locales, (v) => { return v === locale })
            }
        } else {
            locales.push(locale)
        }
        this.setState({
            saved: false,
            locales: locales
        })
    }

    saveSettings() {
        switch (this.state.stage) {
            case 0:
                if (this.state.name.trim() && Array.isArray(this.state.locales) && this.state.locales.length !== 0) {
                    const stage = window.user_detail.admin === -1 ? 1 : 2 // Multiplatform paywall soft-disable
                    this.setState({ stage: stage, error: '' })
                } else {
                    this.setState({ error: 'Please Complete All Fields' })
                }
                break
            case 1:
                if (this.state.google || this.state.alexa) {
                    if (this.state.google && this.state.alexa && window.user_detail.admin === -1) { // Multiplatform paywall soft-disable
                        // Modal
                    } else {
                        this.setState({ stage: 2, error: '' })
                    }
                } else {
                    this.setState({ error: 'Must select at least one platform' })
                }
                break
            default:
                break
        }
    }

    goBack() {
        switch (this.state.stage) {
            case 1:
                this.setState({ stage: 0 })
                break
            case 2:
                this.setState({ stage: window.user_detail.admin === -1 ? 1 : 0 }) // Multiplatform paywall soft-disable
                break
            default:
                break
        }

    }

    componentDidMount() {
        this.loadDefaultTemplates()
    }

    createSkill(module_id) {
        this.setState({ loading: true })

        if(localStorage.getItem('is_first_session') === 'true'){
            axios.post('/analytics/track_first_project')
            .catch(err => {
                console.error(err)
            })
        }
        axios.post(`/marketplace/template/${module_id}/copy`, {
            name: this.state.name,
            locales: this.state.locales,
            platform: this.state.google ? 'google' : 'alexa'
        })
            .then(res => {
                if (res.data.skill_id && res.data.diagram) {
                    setTimeout(() => {
                        this.props.history.push(`/canvas/${res.data.skill_id}/${res.data.diagram}`)
                    }, 3000)
                } else {
                    throw new Error('Invalid Response Format')
                }
            })
            .catch(err => {
                console.error(err)
                alert('unable to create skill')
            })
    }

    previewTemplate(template) {
        this.setState({
            preview: true,
            template: template,
            diagram_id: template.diagram_id
        })
    }

    loadDefaultTemplates() {
        axios.get('/marketplace/default_templates')
            .then(res => {
                if (Array.isArray(res.data)) {
                    this.setState({
                        templates: res.data
                    })
                    // preload images for performance
                    this.images = []
                    res.data.forEach((template, i) => {
                        this.images[i] = new Image()
                        this.images[i].src = template.module_icon
                    })
                } else {
                    throw new Error('Malformed Response')
                }
            })
            .catch(err => {
                console.log(err.response)
                alert('Unable to Retrieve Templates')
            })
    }

    renderContinueButton() {
        if (this.state.alexa && this.state.google && window.user_detail.admin === -1) { // Multiplatform paywall soft-disable
            return (<div className="mt-1">
                <div className="mb-4 text-muted">Building for both platforms simultaneously is a premium feature.<br />Please upgrade to continue</div>
                <MUIButton varient="contained" className="btn-primary" onClick={() => this.props.history.push('/account/upgrade')}>Upgrade</MUIButton>
            </div>)
        } else {
            return (<div className="mt-1">
                <MUIButton varient="contained" className="btn-primary" onClick={this.saveSettings}>Continue</MUIButton>
            </div>)
        }
    }

    renderBody() {
        switch (this.state.stage) {
            case 2:
                return <div className="container text-center">
                    <h5 className="uppercase-header mb-5">Choose Your Template</h5>
                    <div className="mt-4">
                        <div className="grid-col-3 mx--4">
                            {this.state.templates.map(template =>
                                <TemplateCard
                                    key={template.module_id}
                                    template={template}
                                    createSkill={this.createSkill}
                                    previewTemplate={this.previewTemplate}
                                />)}
                        </div>
                    </div>
                </div>
            case 1:
                return <div className="container text-center d-flex flex-fill flex-column">
                    <h5 className="text-dark mb-5">Select Your Platforms</h5>
                    <div className="d-flex flex-fill flex-column justify-content-center">
                        <div className="pb-5 mb-5 align-self-center">
                            <div className="px-4 py-2 text-center project-card">
                                <div className="mb-4 text-muted">Are you building for Alexa, Google, or both?</div>
                                <div className="mx--1 d-flex justify-content-center">
                                    <button color="primary" className={`d-flex justify-content-center template-platform-btn ${this.state.alexa ? 'active' : ''}`} onClick={() => { this.setState({ alexa: !this.state.alexa, error: '' }) }}>
                                        <div className={`platform-checkbox ${this.state.alexa ? 'active' : ''}`}/>
                                        <div className="image-container d-flex flex-column justify-content-between">
                                            <div className={`platform-label mt-2 ${this.state.alexa ? 'active' : ''}`}>Alexa</div>
                                            <img className="platform-image alexa" src="/alexa.png" alt="empty" />
                                        </div>
                                    </button>
                                    <button color="primary" className={`d-flex justify-content-center template-platform-btn ${this.state.google ? 'active' : ''}`} onClick={() => { this.setState({ google: !this.state.google, error: '' }) }}>
                                        <div className={`platform-checkbox ${this.state.google ? 'active' : ''}`}/>
                                        <div>
                                            <div className={`platform-label mt-2 ${this.state.google ? 'active' : ''}`}>Google</div>
                                            <img className="platform-image mt-2" src="/google_home.png" alt="empty" />
                                        </div>
                                    </button>
                                </div>
                                {this.state.error && <Alert color='danger' style={{ visibility: this.state.error ? 'visible' : 'hidden' }} className="my-4 d-inline-block fadeIn">&nbsp;{this.state.error}&nbsp;</Alert>}
                                <br />
                            </div>
                            {this.renderContinueButton()}
                        </div>
                    </div>
                </div>
            default:
                return <div id="name-box" className="text-center">
                    <div className="mb-5">
                        <h5 className="uppercase-header">Create Project</h5>
                        <Alert color='danger' style={{ visibility: this.state.error ? 'visible' : 'hidden' }} className="mt-3 d-inline-block">&nbsp;{this.state.error}&nbsp;</Alert><br />
                        <input
                            id="skill-name"
                            className="input-underline mb-4"
                            type="text"
                            name="name"
                            value={this.state.name}
                            onChange={this.handleChange}
                            placeholder="Enter your project name"
                            required
                        />
                    </div>
                    <label className="mt-4 mb-3 form-title">Select Regions</label>
                    <div className="grid-col-3 mx--1">
                        {LOCALE_MAP.map((locale, i) => {
                            const active = this.state.locales.includes(locale.value) ? "active" : "";
                            return <button className={`country-checkbox btn-darken ${active}`} key={i} onClick={() => { this.onLocaleBtnClick(locale.value) }}>
                                <span>{locale.name}</span><img src={`/images/icons/countries/${locale.value}.svg`} alt={locale.name}></img>
                            </button>
                        })}
                    </div>
                    <div className="mt-5">
                        <button varient="contained" className="btn-primary" onClick={this.saveSettings}>Continue</button>
                    </div>
                </div>
        }
    }

    render() {
        if (this.state.loading) {
            return React.createElement(Spinner, {name: 'Templates'})
        }

        return <div id="template-box-container">
            <div className="card">
                {[1,2].includes(this.state.stage) &&
                    <div id="return-template" className="mr-3 btn-icon" onClick={()=>this.goBack()}/>
                }
                <Link id="exit-template" to='/dashboard' className="btn-icon"></Link>
                {this.renderBody()}
            </div>
            <Modal isOpen={this.state.preview} size="xl" toggle={() => this.setState({ preview: false })} onClosed={() => { this.setState({ diagram_id: null }) }} className="light-canvas-modal">
                <div id="light-canvas-wrap">
                    <div className="no-select" id="PreviewBar">
                        <h3 className="font-weight-light">{this.state.template.title} Preview</h3>
                    </div>
                    <LightCanvas diagram_id={this.state.diagram_id} />
                </div>
                <button className="goback-btn position-absolute" onClick={() => this.setState({ preview: false })} style={{ top: 320, left: -90 }} />
                <div className="position-absolute" style={{ bottom: -75, left: '50%', marginLeft: -73 }}>
                    <MUIButton varient="contained" className="btn-primary" onClick={() => this.createSkill(this.state.template.module_id)}>Select Template</MUIButton>
                </div>
            </Modal>
        </div>
    }
}

export default Templates