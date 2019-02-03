import React, { Component } from 'react'
import axios from 'axios'
import TemplateCard from './TemplateCard'
import LOCALE_MAP from './../../../services/LocaleMap'
import { Modal, Alert } from 'reactstrap'
import {Link} from 'react-router-dom'
import _ from 'lodash'
import './Template.css'
import LightCanvas from './../Canvas/LightCanvas'
import MUIButton from '@material-ui/core/Button';
class Templates extends Component {
    constructor(props){
        super(props)

        this.state = {
            stage: 0,
            loading: false,
            preview: false,
            templates: [],
            name: '',
            locales: ['en-US'],
            error: '',
            template: {}
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
                _.remove(locales, (v) => { return v === locale})
            }
        } else {
            locales.push(locale)
        }
        this.setState({
            saved: false,
            locales : locales
        })
    }

    saveSettings() {
        if(this.state.name.trim() && Array.isArray(this.state.locales) && this.state.locales.length !== 0){
          this.setState({stage: 1})
        }else{
          this.setState({error: 'Please Complete All Fields'})
        }
    }

    componentDidMount(){
        this.loadDefaultTemplates()
    }

    createSkill(module_id){
        this.setState({loading: true})
        axios.post(`/marketplace/template/${module_id}/copy`, {
            name: this.state.name,
            locales: this.state.locales
        })
        .then(res => {
            if(res.data.skill_id && res.data.diagram){
                setTimeout(()=>{
                    this.props.history.push(`/canvas/${res.data.skill_id}/${res.data.diagram}`)
                }, 3000)
            }else{
                throw new Error('Invalid Response Format')
            }
        })
        .catch(err => {
            console.error(err)
            alert('unable to create skill')
        })
    }

    previewTemplate(template){
        this.setState({
            preview: true,
            template: template,
            diagram_id: template.diagram_id
        })
    }

    loadDefaultTemplates(){
        axios.get('/marketplace/default_templates')
        .then(res => {
            if(Array.isArray(res.data)){
                this.setState({
                    templates: res.data
                })
                // preload images for performance
                this.images = []
                res.data.forEach((template, i)=>{
                    this.images[i] = new Image()
                    this.images[i].src = template.module_icon
                })
            }else{
                throw new Error('Malformed Response')
            }
        })
        .catch(err => {
            console.log(err.response)
            alert('Unable to Retrieve Templates')
        })
    }

    renderBody() {
        switch(this.state.stage){
            case 1:
                return <div className="container text-center">
                    <h5 className="text-dark mb-5">CHOOSE YOUR TEMPLATE</h5>
                    <hr/>
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
            default:
                return <div id="name-box" className="text-center">
                    <div className="mb-5">
                        <h5 className="text-dark">NAME & REGION</h5>
                        <Alert color='danger' style={{visibility: this.state.error ? 'visible': 'hidden'}} className="mt-3 d-inline-block">&nbsp;{this.state.error}&nbsp;</Alert><br/>
                        <input
                            id="skill-name"
                            className="input-underline"
                            type="text"
                            name="name"
                            value={this.state.name}
                            onChange={this.handleChange}
                            placeholder="Enter your project name"
                            required
                        />
                    </div>
                    <div className="text-muted mt-4 mb-3">Select Regions</div>
                    <div className="grid-col-3 mx--1">
                        {LOCALE_MAP.map((locale, i) => {
                            const active = this.state.locales.includes(locale.value) ? "active" : "";
                            return <button className={`country-checkbox btn-darken ${active}`} key={i} onClick={() => { this.onLocaleBtnClick(locale.value)}}>
                                <span>{locale.name}</span><img src={`/images/icons/countries/${locale.value}.svg`} alt={locale.name}></img>
                            </button>
                        })}
                    </div>
                    <div className="mt-5">
                        <MUIButton varient="contained" className="purple-btn" onClick={this.saveSettings}>Continue</MUIButton>
                    </div>
                </div>
        }
    }

    render() {
        if(this.state.loading){
            return <div id="loading-diagram">
                <div className="text-center">
                    <h5 className="text-muted mb-2">Loading New Skill</h5>
                    <span className="loader"/>
                </div>
            </div>
        }

        return <div id="template-box-container">
            <div className="card">
                <Link id="exit-template" to='/dashboard' className="close">&times;</Link>
                {this.renderBody()}
            </div>
            <Modal isOpen={this.state.preview} size="xl" toggle={()=>this.setState({preview: false})} onClosed={()=>{this.setState({diagram_id: null})}} className="light-canvas-modal">
                <div id="light-canvas-wrap">
                    <div className="no-select" id="PreviewBar">
                        <h3 className="font-weight-light">{this.state.template.title} Preview</h3>
                    </div>
                    <LightCanvas diagram_id={this.state.diagram_id}/>
                </div>
                <button className="goback-btn position-absolute" onClick={()=>this.setState({preview: false})} style={{top: 320, left: -90}}/>
                <div className="position-absolute" style={{bottom: -75, left: '50%', marginLeft: -73}}>
                    <MUIButton varient="contained" className="purple-btn" onClick={()=>this.createSkill(this.state.template.module_id)}>Select Template</MUIButton>
                </div>
            </Modal>
        </div>
    }
}

export default Templates