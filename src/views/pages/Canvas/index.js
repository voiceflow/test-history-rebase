import React, { Component } from 'react'
import * as SRD from 'storm-react-diagrams'
import Menu from './Menu'
import Editor from './Editor'
import moment from 'moment'
import axios from 'axios'
import update from 'immutability-helper';
// import Loader from './Loader'
import 'draft-js/dist/Draft.css'
import 'storm-react-diagrams/dist/style.min.css'
import './StoryBoard.css'
import ActionGroup from './ActionGroup'
import TemplateConfirmModal from './../../components/Modals/TemplateConfirmModal'
import HelpModal from './HelpModal'
import TestModal from './Test/TestModal'
import new_template from './../../../assets/templates/new'
import { ButtonGroup, Alert } from 'reactstrap'
import cloneDeep from 'lodash/cloneDeep'
import {convertDiagram} from './util'
import Spotlight from './Spotlight'
import FlowBar from './FlowBar'
import DefaultModal from 'views/components/Modals/DefaultModal'
import ShortCuts from 'views/components/ShortCuts'
import Mousetrap from 'mousetrap'

import { BlockNodeModel } from './SRD/models/BlockNodeModel'
import { BlockLinkFactory } from './SRD/factories/BlockLinkFactory'
import { BlockPortFactory } from './SRD/factories/BlockPortFactory'
import { BlockNodeFactory } from './SRD/factories/BlockNodeFactory'

import { SLOT_TYPES_MAP, SLOT_TYPES_UNIVERSAL } from './Constants'

import { getIntentSlots } from 'Helper'

// import Joyride from 'react-joyride'
// import { rejects } from 'assert'

const NLC = require('natural-language-commander')
const _ = require('lodash')
const line_color = '#D1D8E2'
const line_width = 2.5

const commandHasIntent = (node, intent) => {
    return (node.extras.type === 'command' && node.extras.intent && node.extras.intent.value === intent)
}

const generateID = () => {
    return "xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0
        const v = c === "x" ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

const _getUtterancesWithSlotNames = (utterances, slots) => {

	const re = /(\{\{\[[^}{[\]]+]\.([a-zA-Z0-9]+)\}\})/g;
	let m;

	const utterance_text = utterances.map(e => e.text)

	const new_utterances = utterance_text.map( input => {
		let new_input = input
		do {
			m = re.exec(input)
			if (m) {
				const replace = m[1]
				const key = m[2]
				const slot =_.find(slots, { key: key })
				if (slot) {
					let slot_name = _.find(slots, { key: key }).name
					new_input = new_input.replace(replace, `{${slot_name}}`)
				} else {
					return new_input
				}
			}
		} while (m);
		return new_input
	})
	return new_utterances
}

const _getSlotsForKeys = (keys, slots) => {
	let key_set = new Set()

	keys.forEach(key_arr => {
		key_arr.forEach(key => {
			key_set.add(key)
		})
	})

	key_set = [...key_set]

	return key_set.map(key => {
        const slot = _.find(slots, {key: key})
        let type = slot.type.value !== 'CUSTOM' ? slot.type.value : slot.name

		return {
			name: slot.name,
			type: type
		}
	})
}

class Canvas extends Component {
    constructor(props) {
        super(props)

        this.updateSkill = this.updateSkill.bind(this)
        this.repaint = this.repaint.bind(this)
        this.loadDiagram = this.loadDiagram.bind(this)
        this.setVariables = this.setVariables.bind(this)
        this.setGlobalVariables = this.setGlobalVariables.bind(this)
        this.toggleTestModal = this.toggleTestModal.bind(this)
        this.onSave = this.onSave.bind(this)
        this.onTest = this.onTest.bind(this)
        this.onDiagramUnfocus = this.onDiagramUnfocus.bind(this)
        this.unsave = this.unsave.bind(this)
        this.onDrop = this.onDrop.bind(this)
        this.runTest = this.runTest.bind(this)
        this.createDiagram = this.createDiagram.bind(this)
        this.enterFlow = this.enterFlow.bind(this)
        this.removeNode = this.removeNode.bind(this)
        this.addRemoveListener = this.addRemoveListener.bind(this)
        this.copyNode = this.copyNode.bind(this)
        this.copyFlow = this.copyFlow.bind(this)
        this.deleteFlow = this.deleteFlow.bind(this);
        this.renameFlow = this.renameFlow.bind(this);
        this.zoom = this.zoom.bind(this)
        this.loadUserModules = this.loadUserModules.bind(this)
        this.handleTemplateChoice = this.handleTemplateChoice.bind(this)
        this.toggleTemplateConfirm = this.toggleTemplateConfirm.bind(this)
        this.replaceWithTemplate = this.replaceWithTemplate.bind(this)
        this.createWithTemplate = this.createWithTemplate.bind(this)
        this.createFlowFromTemplate = this.createFlowFromTemplate.bind(this)
        this.onFlowRenamed = this.onFlowRenamed.bind(this)
        this.clickDiagram = this.clickDiagram.bind(this)
        this.setCanFulfill = this.setCanFulfill.bind(this)
        this.updateFulfillmentOnDeletion = this.updateFulfillmentOnDeletion.bind(this)
        this.deleteNodeManually = this.deleteNodeManually.bind(this)
        this.mouseMove = this.mouseMove.bind(this)
        this.centerDiagram = this.centerDiagram.bind(this)
        this.toggleShortcuts = this.toggleShortcuts.bind(this)
        // build diagram tree function from child
        this.buildDiagrams = null
        // preview mode
        // this.preview = !!this.props.preview

        var engine = new SRD.DiagramEngine()
        engine.registerLabelFactory(new SRD.DefaultLabelFactory())
        engine.registerNodeFactory(new BlockNodeFactory())
        engine.registerLinkFactory(new BlockLinkFactory(line_color, line_width))
        engine.registerPortFactory(new BlockPortFactory())

        let open
        let diagram_name = ''

        // ONBOARDING
        this.onboarding = localStorage.getItem('onboarding')
        this.loaded = false

        // Intent Variables All Skills Must Have
        let skill = {
            intents: [],
            slots: [],
            fulfillment: {}
        }

        this.state = {
            skill: {...skill, ...props.skill},
            engine: engine,
            open: open,
            diagram_name: diagram_name,
            diagrams: [],
            products: [],
            error: null,
            loading_diagram: true,
            saving: false,
            saved: true,
            last_save: props.skill.last_save,
            testing_modal: false,
            testing_info: false,
            variables: [],
            help: null,
            helpOpen: false,
            currentProduct: null,
            user_modules: null,
            user_templates: [],
            email_templates: [],
            display_templates: [],
            diagram_level_intents: new Set(),
            confirm_info: null,
            default_templates: [],
            spotlight: false,
            keyboard_help: false
        }

        // SKILL IS LOADED HERE
        if(!this.props.preview){
            // this.loadProducts()
            // this.loadUserModules()
            this.onLoadTemplates()
        }
        this.onLoadDiagrams()
    }

    componentDidMount() {
        Mousetrap.bind(['shift+/'], this.toggleShortcuts)
        Mousetrap.bind(['command+s'], (e)=>{
            e.preventDefault()
            if (!this.state.saved) {
                this.onSave()
            }
        })
        Mousetrap.bind('esc', () => (this.state.spotlight && this.setState({spotlight: false})))
        Mousetrap.bind('space', (e) => {
            if(this.diagram_focus){
                this.onDiagramUnfocus()
                this.setState({spotlight: true})
                e.preventDefault()
                e.stopPropagation()
            }
        })
    }

    static getDerivedStateFromProps(props, state){
        if (props.skill !== state.skill){
            return {
                skill: props.skill
            }
        }
        return null;
    }
    componentWillUnmount() {
        Mousetrap.reset()
        if(!this.props.preview && this.state.skill && this.state.skill.skill_id && this.props.diagram_id && !window.error){
            this.onSave(null, false, false)
        }
    }

    componentDidUpdate(previous_props) {
        if(previous_props.diagram_id !== this.props.diagram_id){
            if(this.buildDiagrams !== null){
                this.buildDiagrams(this.props.diagram_id)
            }
            this.setState({
                loading_diagram: true,
                open: false
            }, () => {
              let nodes = _.values(this.state.engine.diagramModel.nodes)
              this.state.engine.enableRepaintEntities(nodes)
              this.state.engine.repaintCanvas(false)
              this.onLoadId(this.props.diagram_id)
            })
        }
    }

    toggleShortcuts(){this.setState({keyboard_help: !this.state.keyboard_help})}

    async onLoadTemplates(){
        if(window.user_detail && window.user_detail.admin > 0 && this.state.skill){
            // LOAD EMAIL TEMPLATES IF ON PLAN > 1
            try {
                const res = await axios.get(`/email/templates?skill_id=${this.state.skill.skill_id}`)
                if(Array.isArray(res.data)){
                    let templates = res.data.map(t => {
                        let variables = [];
                        if(t.variables){
                            try{
                                variables = JSON.parse(t.variables);
                            }catch(err){
                                console.error(err);
                            }
                        }

                        return {
                            title: t.title,
                            sender: t.sender,
                            template_id: t.template_id,
                            variables: variables
                        }
                    })
                    this.setState({
                        email_templates: templates
                    })
                }
            } catch(err) {
                console.error(err)
                // this.props.onError('Unable to Retrieve Email Templates')
            }
        }

        // LOAD MULTIMODAL/VISUAL TEMPLATES
        try {
            const res = await axios.get(`/multimodal/displays?skill_id=${this.state.skill.skill_id}`)
            if(Array.isArray(res.data)){
                let displays = res.data.map(t => {
                    return {
                        title: t.title,
                        display_id: t.id,
                        document: t.document,
                        description: t.description,
                        datasource: t.datasource
                    }
                })
                this.setState({
                    display_templates: displays
                })
            }
        } catch(err) {
            console.error(err)
            // this.props.onError('Unable to Retrieve Visual Templates')
        }

        // LOAD PRODUCTS
        if(this.state.skill.locales.includes('en-US')){
            try{
                const res = await axios.get('/skill/'+this.state.skill.skill_id+'/products')
                if(Array.isArray(res.data)){
                    this.setState({
                        products: res.data
                    })
                }
            }catch(err){
                console.error(err)
            }
        }
    }

    mouseMove({clientX, clientY}){
        this.mouseX = clientX
        this.mouseY = clientY
    }

    zoom(delta){
        let engine = this.state.engine
        let diagramModel = engine.getDiagramModel()
        const oldZoomFactor = diagramModel.getZoomLevel() / 100
        let scrollDelta = delta / 60

        if(scrollDelta < 0){
            if (diagramModel.getZoomLevel() + scrollDelta > 10) {
                diagramModel.setZoomLevel(diagramModel.getZoomLevel() + scrollDelta)
            }else{
                diagramModel.setZoomLevel(10)
            }
        }else{
            if (diagramModel.getZoomLevel() + scrollDelta < 150) {
                diagramModel.setZoomLevel(diagramModel.getZoomLevel() + scrollDelta)
            }else{
                diagramModel.setZoomLevel(150)
            }
        }

        const zoomFactor = diagramModel.getZoomLevel() / 100

        const boundingRect = engine.canvas.getBoundingClientRect()
        const clientWidth = boundingRect.width
        const clientHeight = boundingRect.height
        // compute difference between rect before and after scroll
        const widthDiff = clientWidth * zoomFactor - clientWidth * oldZoomFactor
        const heightDiff = clientHeight * zoomFactor - clientHeight * oldZoomFactor
        // compute mouse coords relative to canvas
        const clientX = clientWidth/2 - boundingRect.left
        const clientY = clientHeight/2 - boundingRect.top

        // compute width and height increment factor
        const xFactor = (clientX - diagramModel.getOffsetX()) / oldZoomFactor / clientWidth
        const yFactor = (clientY - diagramModel.getOffsetY()) / oldZoomFactor / clientHeight

        diagramModel.setOffset(
            diagramModel.getOffsetX() - widthDiff * xFactor,
            diagramModel.getOffsetY() - heightDiff * yFactor
        )

        this.setState({
            engine: engine
        })
    }

    handleTemplateChoice(module){
        this.toggleTemplateConfirm(module)
    }

    replaceWithTemplate(module_id){
        this.setState({
            template_confirm: null
        })

        axios.get(`/marketplace/template/${module_id}/`, {
            diagram_id: this.props.diagram_id
        })
        .then(res => {
            this.loadDiagram(res.data)
        })
        .catch(err => {
            console.log(err.response)
            this.setState({
                saving: false
            })
            this.props.onError('Error retrieving template')
        })
    }

    createFlowFromTemplate(module_id){
        if(this.props.preview) return

        var engine = this.state.engine
        var type = 'flow'

        axios.get(`/marketplace/template/${module_id}/`, {
            diagram_id: this.props.diagram_id
        })
        .then(res => {
            var node = new BlockNodeModel(type.charAt(0).toUpperCase() + type.substr(1))
            node.addInPort(' ')
            node.addOutPort(' ').setMaximumLinks(1)
            node.extras = {
                diagram_id: null,
                inputs: [],
                outputs: []
            }

            engine.stopMove()
            node.extras.type = type
            node.x = 100
            node.y = 100
            node.setSelected()
            engine.getDiagramModel().clearSelection()
            engine.getDiagramModel().addNode(node)
            engine.setSuperSelect(node)
            this.addRemoveListener(node)
            this.setState({
                engine: engine,
                open: type !== 'comment',
                template_confirm: null
            })
            this.createDiagram(node, undefined, JSON.parse(res.data.data))
        })
        .catch(err => {
            console.log(err.response)
            this.setState({
                saving: false
            })
            this.props.onError('Error retrieving template')
        })
    }

    toggleTemplateConfirm(module){
        if(!!this.state.template_confirm){
            this.setState({
                template_confirm: null
            })
        } else {
            let confirm = {
                text: `Replace current flow or create new subflow with ${module.title} template?`,
                replaceWithTemplate: ()=> this.replaceWithTemplate(module.module_id),
                createFlow: () => this.createFlowFromTemplate(module.module_id)
            }
            this.setState({
                template_confirm:confirm
            })
        }
    }

    createWithTemplate(module){
        axios.get(`/marketplace/template/${module.module_id}`, {
            diagram_id: this.props.diagram_id
        })
        .then(res => {
            this.loadDiagram(res.data)
        })
        .catch(err => {
            console.log(err.response)
            this.setState({
                saving: false
            })
            this.props.onError('Error retrieving template')
        })
    }

    removeNode(){
        let selected = this.state.engine.getSuperSelect()
        this.state.engine.stopMove()
        if(selected){
            selected.remove()
        }
    }

    // copy individual node
    copyNode() {
        let selected = this.state.engine.getSuperSelect()
        if(selected.extras.type !== 'story'){
            let engine = this.state.engine
            engine.stopMove()

            var node = new BlockNodeModel(selected.name + ' copy')
            node.extras = cloneDeep(selected.extras)

            let ports = selected.getPorts()

            for (var name in ports) {
                let port = ports[name]
                port.in ? node.addInPort(port.label) : node.addOutPort(port.label).setMaximumLinks(1)
            }

            node.x = selected.x + 30
            node.y = selected.y + 30

            engine.getDiagramModel().clearSelection()
            node.setSelected()
            engine.setSuperSelect(node)
            engine.getDiagramModel().addNode(node)
            this.addRemoveListener(node)

            this.setState({
                engine: engine
            })
        }
    }

    copyFlow(flow_id) {
        let flow = this.state.diagrams.find(d => d.id === flow_id)
        if (!flow) {
            return
        }

        this.setState({
            loading_diagram: true
        })
        const copy = (save = true) => {

            let new_flow_name = flow.name + ' (COPY)'
            let index = 1
            const exists = (name) => this.state.diagrams.find(d => d.name === name)
            while (exists(new_flow_name)) {
                new_flow_name = `${flow.name} (COPY ${index})`
                index++
            }

            axios.get(`/diagram/copy/${flow_id}?name=${encodeURI(new_flow_name)}`)
                .then((res) => {
                    let diagrams = this.state.diagrams
                    diagrams.push({
                        id: res.data,
                        name: new_flow_name
                    })
                    this.setState({
                        diagrams: diagrams
                    }, this.enterFlow(res.data, save))
                })
                .catch((err) => {
                    this.setState({
                        loading_diagram: false,
                        text: < Alert color = "danger" > Unable to Copy Flow </Alert>,
                        confirm: {
                            confirm: this.setState({
                                confirm: null
                            })
                        }
                    })
                })
        }

        if (flow_id === this.props.diagram_id) {
            this.onSave(() => {
                copy(false)
            })
        } else {
            copy(true)
        }
    }
    
    deleteFlow(flow_id) {
        this.setState({
            confirm: {
                warning: true,
                text: <Alert color = "danger"
                className = "mb-0" >
                <i className = "fas fa-exclamation-triangle fa-2x" />
                < br />
                Deleting this flow permanently deletes everything inside and can not be recovered
                <br />
                <br />
                Are you sure ?
                </Alert>,
                confirm : () => {
                    this.setState({
                        confirm: null
                    })
                    axios.delete('/diagram/' + flow_id)
                        .then(() => {
                            let index = this.state.diagrams.findIndex(d => d.id === flow_id)
                            if (index !== -1) {
                                let diagrams = this.state.diagrams;
                                diagrams.splice(index, 1)
                                this.setState({
                                    diagrams: diagrams
                                })
                            }
                            // If they are deleting the flow they are currently on, go back to ROOT
                            if (flow_id === this.props.diagram_id) {
                                this.enterFlow(_.find(this.state.diagrams, d => d.name === 'ROOT').id, false)
                            }
                        })
                        .catch(err => {
                            console.log(err)
                            alert('failed to delete diagram')
                        })
                }
            }
        })
    }

    renameFlow(flow_id, name){
        name = name.trim()
        let index = this.state.diagrams.findIndex(d => d.id === flow_id)
        if (index !== -1) {
            let flow = this.state.diagrams[index]
            if (flow.name !== name) {
                // Make sure that names are unique
                let find = this.state.diagrams.find(d => d.name === name)
                if (find) {
                    return this.setState({
                        confirm: {
                            text: 'Flow names must be unique',
                            confirm: () => this.setState({
                                confirm: null
                            })
                        }
                    })
                }

                let old_name = flow.name
                this.setState({diagrams: update(this.state.diagrams, {
                    [index]: {name : {$set: name}}
                })})

                axios.post(`/diagram/${flow.id}/name`, {
                        name: name
                    })
                    .then(() => {
                        this.onFlowRenamed(flow.id)
                    })
                    .catch(err => {
                        alert('Error - Name not Updated')
                        this.setState({diagrams: update(this.state.diagrams, {
                            [index]: {name : {$set: old_name}}
                        })})
                    })
            }
        }
    }

    clickDiagram(e){
        this.diagram_focus=true
        let engine = this.state.engine
        let selected = engine.getDiagramModel().getSelectedItems("node")
        if (selected.length === 1) {
            if(selected[0].extras.type === 'comment'){
                this.diagram_focus=false
            }else{
                engine.setSuperSelect(selected[0])
                this.setState({
                    engine: engine,
                    open: true
                })
            }
        } else if (selected.length === 0) {
            let model = engine.getDiagramModel()
            let nodes = model.getNodes()
            for (let key in nodes) {
                if (nodes[key].extras.type === 'comment' && nodes[key].name.trim().length === 0) {
                    model.removeNode(nodes[key].getID())
                    this.forceUpdate()
                }
            }
        }
    }

    loadUserModules(){
        axios.get('/marketplace/user_module')
        .then(res => {
            let user_modules = []
            let user_templates = []
            for(var i=0; i<res.data.length;i++){
                if(res.data[i].type === 'FLOW'){
                    user_modules.push(res.data[i])
                } else {
                    user_templates.push(res.data[i])
                }
            }

            this.setState({
                user_modules: user_modules,
                user_templates: user_templates
            })
        })
        .catch(err => {
            console.log(err.response)
            this.setState({
                saving: false
            })
            this.props.onError('Error retrieving modules')
        })
    }

    onDiagramUnfocus() {
        this.diagram_focus = false
        this.state.engine.getDiagramModel().clearSelection()
    }

    repaint() {
        this.state.engine.repaintCanvas()
    }

    onSave(cb, is_new=false, state=true) {

        try {
            state && this.setState({ saving: true })
            var engine = this.state.engine
            var model = engine.getDiagramModel()
            let serialize = model.serializeDiagram()
            serialize.id = this.props.diagram_id
            var data = JSON.stringify(serialize)

            let sub_diagrams = []
            let used_intent_names = new Set()
            let used_intents = []

            serialize.nodes.forEach(node => {
                if(node.extras.diagram_id){
                    sub_diagrams.push(node.extras.diagram_id)
                }else if (node.extras.type === 'interaction') {
                    node.extras.choices.forEach(choice => {
                        if (choice.intent && !used_intent_names.has(choice.intent.value)) {
                            if (choice.intent.built_in) {
                                used_intents.push({
                                    intent: choice.intent.value,
                                    built_in: true
                                })
                            } else {
                                used_intents.push({
                                    intent: choice.intent.value,
                                    built_in: false
                                })
                            }
                            used_intent_names.add(choice.intent.value)
                        }
                    })
                }
            })

            for (var i = 0; i < this.state.diagrams.length; i++) {
                let diagrams = this.state.diagrams
                if(diagrams[i].id === this.props.diagram_id){
                    diagrams[i].sub_diagrams = sub_diagrams
                }
                state && this.setState({
                    diagrams: diagrams
                }, () => {
                    if(this.buildDiagrams !== null){
                        this.buildDiagrams(this.props.diagram_id)
                    }
                })
            }

            // UPDATE SKILL GLOBALS HOTFIX
            let skill = this.state.skill;
            skill.global = this.state.skill.global
            this.props.updateSkill(skill)

            var diagram = {
                id: this.props.diagram_id,
                title: this.state.diagram_name,
                variables: this.state.variables,
                data: data,
                skill: this.state.skill.skill_id,
                sub_diagrams: JSON.stringify(sub_diagrams),
                used_intents: used_intents,
                global: this.state.skill.global
            }

            const s = this.state.skill;
            const save_skill_intents = new Promise((resolve, reject) => {
                axios.patch('/skill/' + s.skill_id + '?intents=true', {
                    intents: JSON.stringify(s.intents),
                    slots: JSON.stringify(s.slots),
                    fulfillment: JSON.stringify(s.fulfillment),
                    account_linking: JSON.stringify(s.account_linking)
                })
                .then(res => {
                    resolve()
                })
                .catch(err => {
                    reject(err)
                })
            })

            const save_diagram = new Promise ((resolve, reject) => {
                axios.post(`/diagram${is_new ? '?new=1' : ''}`, diagram)
                .then(() => {
                    resolve()
                })
                .catch(err => {
                    reject(err)
                })
            })
            
            Promise.all([save_skill_intents, save_diagram]).then(res => {
                state && this.setState({
                    saving: false,
                    saved: true,
                    last_save: Date.now()
                });
                if(typeof cb === "function") cb(this.props.diagram_id)
            }, rej_err => {
                console.log(rej_err)
                state && this.setState({
                    saving: false
                }) && this.props.onError('Error Saving Project')
                if(typeof cb === "function") cb(null)
            })
        } catch (e) {
            console.log(e)
            state && this.props.onError('Error Saving - Project Structure (Check Logs)')
            if(typeof cb === "function") cb(null)
        }
    }

    loadDiagram(diagram) {
        var engine = this.state.engine
        var model = new SRD.DiagramModel()

        let diagram_json = false
        try {
            diagram_json = JSON.parse(diagram.data)
        } catch (e) {
            console.log(e)
        }
        if (this.props.preview){
          model.setLocked(true);
        }
        if (diagram_json) {
            // CONVERT DEPRECATED BLOCKS
            diagram_json = convertDiagram(diagram_json, this.state.diagrams)

            // This should not happen
            if(diagram_json.nodes.length === 0){
                diagram_json = new_template
            }
            engine.setSuperSelect(null)
            model.deSerializeDiagram(diagram_json, engine)
            model.addListener({ linksUpdated: this.unsave })
            model.addListener({ nodesUpdated: this.unsave })

            const diagram_level_intents = new Set()

            var nodes = model.getNodes()
            for (let key in nodes) {
                const node = nodes[key]
                const type = node.extras.type
                this.addRemoveListener(node)
                if ((type === 'intent' && node.extras.intent !== undefined) || (type === 'jump' && node.extras.intent !== undefined)) {
                    if (node.extras.intent) {
                        diagram_level_intents.add(node.extras.intent.key)
                    }
                }
            }

            var links = model.getLinks()
            for (let key in links) {
                links[key].setColor(line_color)
                links[key].setWidth(line_width)
            }

            engine.stopMove()
            engine.setDiagramModel(model)
            // make sure variables are unique and don't overlap with global variables
            let variables = []
            if (Array.isArray(diagram.variables)) {
                diagram.variables.forEach(v => {
                    if(!variables.includes(v) && !this.state.skill.global.includes(v)){
                        variables.push(v)
                    }
                })
            }

            this.setState({
                open: false,
                engine: engine,
                diagram_name: diagram.title ? diagram.title : 'New Flow',
                last_save: this.props.skill.last_save,
                loading_diagram: false,
                variables: variables,
                diagram_level_intents: diagram_level_intents
            })

            this.setState({ saved: true })
        } else {
            this.props.onError('Could Not Open Project - Corrupted File')
        }
    }

    onLoadDiagrams(){
        axios.get('/skill/'+this.state.skill.skill_id+'/diagrams')
        .then(res => {
            this.setState({
                diagrams: res.data.map(flow => {
                    try {
                        return {
                            id: flow.id,
                            name: flow.name,
                            sub_diagrams: JSON.parse(flow.sub_diagrams)
                        }
                    } catch(err) {
                        return {
                            id: flow.id,
                            name: flow.name
                        }
                    }
                })
            }, () => {
                this.onLoadId(this.props.diagram_id)
            })
        })
        .catch(err => {
            console.error(err.response)
            this.props.onError('Could Not Retrieve Project Diagrams')
        })
    }

    onLoadId(diagram_id) {
        axios.get('/diagram/'+ diagram_id)
        .then(res => {
            this.loadDiagram(res.data)
            if(!this.props.preview){
                localStorage.setItem('flow', `${this.state.skill.skill_id}/${diagram_id}`)
            }
            if(this.buildDiagrams !== null){
                this.buildDiagrams(diagram_id)
            }
        })
        .catch(err => {
            console.log(err)
            this.props.onError('Could Not Retrieve Project')
        })
    }

    onFlowRenamed(id) {
        let nodes = this.state.engine.getDiagramModel().getNodes()
        for (let key in nodes) {
            if (nodes[key].extras.type === 'flow' && nodes[key].extras.diagram_id === id) {
                nodes[key].name = this.state.diagrams.find(x => x.id === id).name
            }
        }
        this.repaint()
    }

    unsave(e) {
        if(e && e.node && !e.isCreated){
            let selected = this.state.engine.getSuperSelect()
            if(selected && e.node.id === selected.getID()){
                this.setState({
                    open: false
                })
            }
        }

        if (this.state.saved) {
            this.setState({ saved: false })
        }
    }

    setVariables(variables) {
        this.setState({
            variables: variables,
            saved: false
        })
    }

    setGlobalVariables(variables) {
        let skill = this.state.skill
        skill.global = variables
        this.setState({
            skill: skill,
            saved: false
        })
        this.props.updateSkill(skill)
    }

    toggleTestModal() {
        this.setState({
            testing_info: false,
            testing_modal: !this.state.testing_modal
        })
    }

    runTest() {
        let engine = this.state.engine
        let model = engine.getDiagramModel()
        let data = model.serializeDiagram()

        let nlc = this.state.testing_info ? this.state.testing_info.nlc : null
        let slot_mappings = this.state.testing_info ? this.state.testing_info.slot_mappings : {}

        let nodes = []
        data.nodes.forEach((node) => {
            if(node.extras && node.extras.type !== "story"){
                nodes.push({
                    value: node.id,
                    label: node.name
                })
            }
        })
        if (!nlc) {
            nlc = new NLC()

            let amazon_slots = []

            _.values(SLOT_TYPES_MAP).forEach(a => {
                amazon_slots = amazon_slots.concat(a)
            })
            amazon_slots = amazon_slots.concat(SLOT_TYPES_UNIVERSAL)
            amazon_slots = _.uniq(amazon_slots)
            amazon_slots.forEach(s => {
                const matcher = /[\s\S]*/
                nlc.addSlotType({
                    type: s,
                    matcher: matcher
                })
            })

            slot_mappings = {}
            this.state.skill.slots.forEach(slot => {

                if (slot.type.value && slot.type.value === 'CUSTOM') {
                    nlc.addSlotType({
                        type: slot.name,
                        matcher: slot.inputs
                    })
                }
            })

            this.state.skill.intents.forEach(intent => {
                let samples
                if (!intent.built_in) {
                    samples = _getUtterancesWithSlotNames(intent.inputs, this.state.skill.slots)
                }
                const _slots = _getSlotsForKeys(intent.inputs.map(input => input.slots), this.state.skill.slots)

                nlc.registerIntent({
                    intent: intent.name,
                    slots: _slots,
                    utterances: samples,
                    callback: () => {}
                })

                slot_mappings[intent.name] = _slots
            })

        }

        this.setState({
            testing_info: {
                id: this.props.diagram_id,
                nodes: nodes,
                nlc: nlc,
                slot_mappings: slot_mappings
            }
        })
    }

    onTest() {
        this.state.engine.getDiagramModel().clearSelection()
        this.toggleTestModal()

        if(this.props.preview){
            this.runTest()
        } else {
            this.onSave(diagram_id => {
                if(diagram_id === null){
                    this.setState({
                        testing_modal: false
                    })
                }else{
                    axios.post(`/diagram/${diagram_id}/test/publish`,{
                        intents: this.state.skill.intents,
                        slots: this.state.skill.slots
                    })
                    .then(this.runTest)
                    .catch(err => {
                        console.log(err)
                        this.setState({
                            testing_modal: false
                        })
                        this.props.onError("Could Not Render Your Project")
                    })
                }
            })
        }
    }

    // Create a new diagram from the flow block
    createDiagram(node, base_flow_name='New Flow', template=null){
        this.setState({
            loading_diagram: true
        })

        let id = generateID()
        node.extras.diagram_id = id

        // save the current diagram
        this.onSave(() => {
            // Generate a new diagram, save it, and go to it
            let curr_template
            if(!template){
                curr_template = new_template
            } else {
                curr_template = template
            }
            curr_template.id = id
            let skill_id = this.state.skill.skill_id
            let data = JSON.stringify(curr_template)

            // No Duplicate Flow Names
            let new_flow_name = base_flow_name
            let index = 1
            const exists = (name) => this.state.diagrams.find(d => d.name === name)

            while(exists(new_flow_name)){
                new_flow_name = `${base_flow_name} ${index}`
                index++
            }

            var diagram = {
                id: id,
                title: new_flow_name,
                variables: [],
                data: data,
                skill: skill_id
            }

            axios.post('/diagram?new=1', diagram)
            .then(() => {
                this.state.diagrams.push({
                    name: new_flow_name,
                    id: id
                })
                this.props.history.push(`/canvas/${skill_id}/${id}`)
            })
            .catch(err => {
                console.log(err.response)
                this.setState({
                    saving: false
                })
                this.props.onError('Unable to create new Flow')
            })
        })
    }

    addRemoveListener(node){
        const isRoot = this.state.skill.diagram === this.props.diagram_id
        const type = node.extras.type
        if (type === 'story' || type === 'comment') {
            node.clearListeners()
            node.addListener({ entityRemoved: e => e.stopPropagation() })
        } else if (type === 'command' && isRoot) {
            // DO NOT ALLOW ROOT DIAGRAM HELP/STOP COMMANDS TO BE DELETED
            node.clearListeners()
            node.addListener({ entityRemoved: e => {
                let block = e.entity
                // TODO: make this better
                if(block && block.id){
                    let model = this.state.engine.getDiagramModel()
                    let command_search
                    if(commandHasIntent(block, 'AMAZON.HelpIntent')){
                        command_search = 'AMAZON.HelpIntent'
                    }else if(commandHasIntent(block, 'AMAZON.StopIntent')){
                        command_search = 'AMAZON.StopIntent'
                    }
                    if(command_search){
                        let nodes = model.getNodes()
                        let already_exists = false
                        for (let key in nodes) {
                            if(commandHasIntent(nodes[key], command_search) && nodes[key].getID() !== block.id){
                                already_exists = true
                            }
                        }
                        // Don't remove this command if no other copies exist
                        if(!already_exists) return
                    }

                    model.removeNode(block.id)
                }
            }})
        } else if ((type === 'intent' && node.extras.intent !== undefined) || (type === 'jump' && node.extras.intent !== undefined)) {
            if (isRoot) {
                node.clearListeners()
                node.addListener({
                    entityRemoved: (e) => {
                        this.onDeleteIntentNode(e.entity)
                    }
                })
            }
        }
    }

    enterFlow(new_diagram_id, save=true) {
        if(new_diagram_id !== this.props.diagram_id){
            this.setState({loading_diagram: true})
            if(save && !this.props.preview){
                this.onSave(() => {
                    this.props.history.push(`/canvas/${this.state.skill.skill_id}/${new_diagram_id}`)
                })
            }else if (this.props.preview){
                this.props.history.push(`/preview/${this.state.skill.skill_id}/${new_diagram_id}`)
            }else{
                this.props.history.push(`/canvas/${this.state.skill.skill_id}/${new_diagram_id}`)
            }
        }
    }

    setCanFulfill(intent_key, new_value) {

        const skill = this.state.skill
        const fulfillments = skill.fulfillment
        let fulfillment = fulfillments[intent_key]
        if (fulfillment && !new_value) {
            // Remove fulfillment
            delete fulfillments[intent_key]
        } else if (!fulfillment && new_value) {
            const slot_config = {}
            const intent = _.find(this.state.skill.intents, {key:intent_key})
            const intent_slots = getIntentSlots(intent, this.state.skill.slots)
            intent_slots.forEach(slot => {
                slot_config[slot.key] = []
            })
            fulfillments[intent_key] = {
                slot_config: slot_config
            }
        }
        this.setState({
            skill: skill
        })
    }

    updateFulfillmentOnDeletion(deleted_node) {
        const id = deleted_node.id
        if (deleted_node.extras.intent && deleted_node.extras.intent.key) {
            const key = deleted_node.extras.intent.key
            const new_value = false
            this.setCanFulfill(key, new_value)
            this.state.diagram_level_intents.delete(key)
        }
        this.deleteNodeManually(id)
    }

    onDeleteIntentNode(deleted_node) {
        const skill = this.state.skill
        const fulfillments = skill.fulfillment
        const key = deleted_node.extras.intent ? deleted_node.extras.intent.key : null

        if (key && fulfillments[key]) {
            const confirm_info = {
                text: `CanfulfillIntent is enabled for the "${deleted_node.extras.intent.label}" intent. Deleting this intent will also delete any slot fulfillment values you have set for this intent.`,
                confirm: () => {
                    this.updateFulfillmentOnDeletion(deleted_node)
                    this.setState({
                        confirm_info: null
                    })
                }
            }
            this.props.onConfirm(confirm_info)
        } else {
            this.updateFulfillmentOnDeletion(deleted_node)
        }
    }

    deleteNodeManually(node_id) {
        let engine = this.state.engine
        let model = engine.getDiagramModel()
        model.removeNode(node_id)
        this.forceUpdate()
    }

    onDrop(event) {
        if(this.props.preview) return

        var engine = this.state.engine
        var type, name
        if(typeof event === 'string'){
            type = event
            event = {
                clientX: this.mouseX,
                clientY: this.mouseY
            }
            if(this.state.spotlight){
                this.setState({spotlight: false})
            }
        }else{
            try {
                type = event.dataTransfer.getData('node')
                name = event.dataTransfer.getData('name')
            } catch (e) {
                return
            }
        }

        if(!name){
            name = type.charAt(0).toUpperCase() + type.substr(1)
        }

        var node = new BlockNodeModel(name)

        if(type){
            if (type === 'choice') {
                node.addInPort(' ')
                node.addOutPort('else').setMaximumLinks(1)
                node.extras = {
                    audio: '',
                    audioText: '',
                    audioVoice: '',
                    prompt: '',
                    promptText: '',
                    promptVoice: '',
                    choices: [],
                    inputs: []
                };
            } else if(type === 'exit'){
                node.addInPort(' ')
            } else if (type === 'interaction') {
                node.addInPort(' ');
                node.addOutPort('else').setMaximumLinks(1);
                node.extras = {
                    choices: [],
                    choices_open: []
                };
            } else if (type === 'combine') {
                node.addInPort(' ')
                node.addOutPort(' ').setMaximumLinks(1)
                node.extras = {
                    audio: false,
                    lines: [
                        {
                            collapse: true,
                            audio: false,
                            title: 'Line Audio'
                        }
                    ]
                }
            } else if (type === 'speak') {
                node.addInPort(' ')
                node.addOutPort(' ').setMaximumLinks(1)
                node.extras = {
                    randomize: false
                }
                // ONBOARDING
                // if(this.onboarding && this.state.onboarding_step < 1){
                //     setTimeout(()=>this.setState({onboarding_step: 1, onboarding_run: true}), 400)
                // }
            } else if (type === 'card') {
                node.addInPort(' ')
                node.addOutPort(' ').setMaximumLinks(1)
                node.extras = {
                    cardtype: 'Simple'
                }
            } else if (type === 'reminder') {
                node.addInPort(' ')
                node.addOutPort(' ').setMaximumLinks(1)
                node.addOutPort('fail').setMaximumLinks(1)
                node.extras = {
                    reminder: null
                }
            } else if (type === 'flow') {
                node.addInPort(' ')
                node.addOutPort(' ').setMaximumLinks(1)
                node.extras = {
                    diagram_id: null,
                    inputs: [],
                    outputs: []
                }
            } else if (type === 'intent'){
                node.addOutPort(' ').setMaximumLinks(1)
                node.extras = {
                    intent: null,
                    mappings: [],
                    resume: false
                }
            } else if (type === 'command') {
                node.extras = {
                    intent: null,
                    mappings: [],
                    resume: true
                }
            } else if (type === 'comment') {
                node.name = 'New Comment'
                node.clearListeners()
            } else if (type === 'ending') {
                node.addInPort(' ')
                node.extras = {
                    audio: '',
                    audioText: '',
                    audioVoice: ''
                }
            } else if (type === 'random') {
                node.addInPort(' ')
                node.addOutPort(1).setMaximumLinks(1)
                node.extras = {
                    paths: 1
                }
            } else if (type === 'variable') {
                node.addInPort(' ')
                node.addOutPort(' ').setMaximumLinks(1)
                node.extras = {}
            } else if (type === 'set') {
                node.addInPort(' ')
                node.addOutPort(' ').setMaximumLinks(1)
                node.extras = {
                    sets: []
                }
            } else if (type === 'if') {
                node.addInPort(' ')
                node.addOutPort('else').setMaximumLinks(1)
                node.addOutPort('1').setMaximumLinks(1)
                node.extras = {
                    expressions: [{
                        type: 'value',
                        value: '',
                        depth: 0
                    }]
                }
            } else if (type === 'api') {
                node.name = 'API'
                node.addInPort(' ')
                node.addOutPort(' ').setMaximumLinks(1)
                node.addOutPort('fail').setMaximumLinks(1)
                node.extras = {
                    url: '',
                    method: 'GET',
                    headers: [],
                    body: [],
                    content: '',
                    bodyInputType: 'keyValue',
                    params: [],
                    mapping: [],
                    success_id: '',
                    failure_id: ''
                }
            } else if (type === 'payment') {
                node.addInPort(' ')
                node.addOutPort(' ').setMaximumLinks(1)
                node.addOutPort('fail').setMaximumLinks(1)
                node.extras = {
                    product_id: null
                }
            } else if (type === 'cancel') {
                let data = event.dataTransfer.getData('data')
                node.addInPort(' ')
                node.addOutPort(' ').setMaximumLinks(1)
                node.addOutPort('fail').setMaximumLinks(1)
                node.extras = {
                    product_id: data ? (data*1) : null
                }
            } else if (type === 'link_account') {
                node.name = 'Link Account'
                node.addInPort(' ')
                node.addOutPort(' ').setMaximumLinks(1)
            } else if (type === 'capture') {
                node.addInPort(' ')
                node.addOutPort(' ').setMaximumLinks(1)
                node.extras = {
                    variable: null
                }
            } else if (type === 'mail') {
                node.addInPort(' ')
                node.addOutPort(' ').setMaximumLinks(1)
                node.addOutPort('fail').setMaximumLinks(1)
                node.extras = {
                    template_id: null,
                    mapping: [],
                    to: ''
                }
            } else if (type === 'code') {
                node.addInPort(' ')
                node.addOutPort(' ').setMaximumLinks(1)
                node.addOutPort('fail').setMaximumLinks(1)
                node.extras = {
                    code: ''
                }
            } else if (type === 'display') {
                node.addInPort(' ')
                node.addOutPort(' ').setMaximumLinks(1)
                node.extras = {
                    display_id: null,
                    datasource: '',
                    update_on_change: false
                }
            } else if (type === 'stream') {
                node.addInPort(' ')
                node.addOutPort('stop/pause').setMaximumLinks(1)
                node.extras = {
                    audio: '',
                    player: false
                }
            } else if (type === 'permission') {
                node.addInPort(' ')
                node.addOutPort(' ').setMaximumLinks(1)
                node.extras = {}
            } else if (type === 'permissions') {
                node.name = 'User Info'
                node.addInPort(' ')
                node.addOutPort(' ').setMaximumLinks(1)
                node.addOutPort('fail').setMaximumLinks(1)
                node.extras = {
                    permissions: []
                }
            } else if (type === 'link_account') {
                node.addInPort(' ')
                node.addOutPort(' ').setMaximumLinks(1)
            } else if (type === 'module'){
                node.addInPort(' ')
                node.addOutPort(' ').setMaximumLinks(1)

                try{
                    let data = JSON.parse(event.dataTransfer.getData('data'))
                    let inputs = data.input ? JSON.parse(data.input) : []
                    let outputs = data.output ? JSON.parse(data.output) : []

                    node.name = data.title ? data.title : 'Module'

                    node.extras = {
                        diagram_id: data.diagram_id,
                        mapping: {
                            inputs: inputs.map(i => {
                                return {
                                    key: i,
                                    val: ''
                                }
                            }),
                            outputs: outputs.map(i=>{
                                return {
                                    key: i,
                                    val: ''
                                }
                            })
                        },
                        version_id: data.version_id,
                        module_id: data.module_id,
                        module_icon: data.module_icon,
                        color: data.color
                    }
                }catch(err){
                    console.error(err)
                    return this.props.onError('Error - Module Broken')
                }
            }
            engine.stopMove()
            node.extras.type = type
            var points = engine.getRelativeMousePoint(event)
            node.x = points.x-(node.name.length*4.5 + 40)
            node.y = points.y-30

            node.setSelected()
            engine.getDiagramModel().clearSelection()
            engine.getDiagramModel().addNode(node)

            engine.setSuperSelect(node)
            this.addRemoveListener(node)
            this.setState({
                engine: engine,
                open: type !== 'comment'
            })
        }
    }

    updateSkill(skill){
        this.setState({skill: skill})
        this.props.updateSkill(skill)
    }

    centerDiagram(){
        // RECENTERS THE DIAGRAM ON THE START BLOCK
        let model = this.state.engine.getDiagramModel()
        let nodes = model.getNodes()
        for (let key in nodes) {
            if(nodes[key].extras && nodes[key].extras.type === 'story'){
                this.state.engine.setSuperSelect(nodes[key])
                nodes[key].setSelected()
                this.setState({open: true})
                model.setZoomLevel(80)
                model.setOffset((300)-(nodes[key].x*0.8), (300)-(nodes[key].y*0.8))
                this.repaint()
                return
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <DefaultModal
                    open={this.state.keyboard_help}
                    header="Keyboard Shortcuts"
                    toggle={this.toggleShortcuts}
                    content={<ShortCuts/>}
                />
                <HelpModal
                    open={this.state.helpOpen}
                    help={this.state.help}
                    toggle={()=>this.setState({helpOpen: !this.state.helpOpen})}
                    setHelp={(help) => this.setState({help: help})}
                />
                { !this.props.preview ? <ActionGroup
                        lastSave={(this.state.last_save ? "last saved " + moment(this.state.last_save).fromNow() : "last saved")}
                        skill={this.state.skill}
                        preview={this.props.preview}
                        title={this.state.diagram_name}
                        onSave={this.onSave}
                        saving={this.state.saving}
                        saved={this.state.saved}
                        admin={this.state.admin}
                        publishAMZN={this.publishAMZN}
                        publishMarket={this.publishMarket}
                        diagram_id={this.props.diagram_id}
                        history={this.props.history}
                        onError={this.props.onError}
                        onConfirm={this.props.onConfirm}
                        updateSkill={this.updateSkill}
                        onTest={this.onTest}
                    /> :
                    <div className="title-group no-select">
                    <span className="text-blue" id="preview-title"><span className="dot"/> PREVIEW MODE</span>
                    </div>
                }
                {!!this.state.template_confirm && <TemplateConfirmModal confirm={this.state.template_confirm} toggle={this.toggleTemplateConfirm}/>}
                {this.state.testing_modal ?
                    <TestModal
                        open={this.state.testing_modal}
                        toggle={this.toggleTestModal}
                        skill={this.state.skill}
                        testing_info={this.state.testing_info}
                        diagrams={this.state.diagrams}
                        unfocus={this.onDiagramUnfocus}
                    />
                : null}
                {this.state.spotlight && <Spotlight addBlock={this.onDrop} cancel={()=>this.setState({spotlight: false})}></Spotlight>}
                <div id="canvas" onMouseMove={this.mouseMove}>
                    <Menu
                        unfocus={this.onDiagramUnfocus}
                        helpModal={() => this.setState({help: true, helpOpen: true})}
                        diagrams={this.state.diagrams}
                        current={this.props.diagram_id}
                        enterFlow={this.enterFlow}
                        variables={this.state.variables}
                        global_variables={this.state.skill.global}
                        onGlobalVariable={this.setGlobalVariables}
                        onVariable={this.setVariables}
                        build={fn => this.buildDiagrams = fn}
                        user_modules={this.state.user_modules}
                        user_templates={this.state.user_templates}
                        onTemplateIntent={this.handleTemplateIntent}
                        onFlowRenamed={this.onFlowRenamed}
                        history={this.props.history}
                        user={this.props.user}
                        loading_diagram={this.state.loading_diagram}
                        text={this.state.text}
                        confirm={this.state.confirm}
                        copyFlow={this.copyFlow}
                        deleteFlow={this.deleteFlow}
                        renameFlow={this.renameFlow}
                        updateConfirm={(confirm) => this.setState({confirm: confirm})}
                        saving={this.state.saving}
                        preview={this.props.preview}
                        onSave={this.onSave}
                        onError={this.props.onError}
                    />
                    {this.state.loading_diagram && <div id="loading-diagram">
                        <div className="text-center">
                            <h5 className="text-muted mb-2">Loading Flow</h5>
                            <span className="loader"/>
                        </div>
                    </div>}

                    <Editor
                        skill={this.state.skill}
                        unfocus={this.onDiagramUnfocus}
                        open={this.state.open}
                        node={this.state.engine.getSuperSelect()}
                        onUpdate={this.unsave}
                        close={e => this.setState({ open: false })}
                        repaint={this.repaint}
                        variables={this.state.variables}
                        global_variables={this.state.skill.global}
                        setHelp={(help) => this.setState({help: help, helpOpen: true})}
                        diagrams={this.state.diagrams}
                        createDiagram={this.createDiagram}
                        enterFlow={this.enterFlow}
                        removeNode={!this.props.preview ? this.removeNode : _.noop()}
                        user_modules={this.state.user_modules}
                        copyNode={!this.props.preview ? this.copyNode : _.noop()}
                        intents={this.state.skill.intents}
                        slots={this.state.skill.slots}
                        locales={this.state.skill.locales}
                        preview={this.props.preview}
                        onboarding={this.onboarding}
                        diagram_id={this.props.diagram_id}
                        finished={()=>{this.onboarding = false}}
                        onError={this.props.onError}
                        onConfirm={this.props.onConfirm}
                        templates={this.state.email_templates}
                        displays={this.state.display_templates}
                        setCanFulfill={this.setCanFulfill}
                        history={this.props.history}
                        diagram_level_intents={this.state.diagram_level_intents}
                        products={this.state.products}
                    />
                    <div
                        key={this.props.diagram_id}
                        id="diagram"
                        className={this.props.preview ? " no-padding" : ""}
                        onDrop={this.onDrop}
                        onDragOver={e => e.preventDefault()}
                        onMouseLeave={()=>this.diagram_focus=false}
                        onClick={this.clickDiagram}
                    >
                        <div id="widget-bar">
                            <ButtonGroup>
                                <button onClick={()=>this.zoom(1000)} className="white-circ round-left"><i className="far fa-plus"/></button>
                                <button onClick={()=>this.zoom(-1000)} className="white-circ round-right"><i className="far fa-minus"/></button>
                            </ButtonGroup>
                            <button className="white-circ ml-2" onClick={this.centerDiagram}><i className="fas fa-map-marker-alt"></i></button>
                        </div>
                        { this.state.skill.diagram !== this.props.diagram_id && <FlowBar
                                skill={this.state.skill}
                                deleteFlow={this.deleteFlow}
                                copyFlow={this.copyFlow}
                                renameFlow={this.renameFlow}
                                enterFlow={this.enterFlow}
                                diagram = {_.find(this.state.diagrams, d => d.id === this.props.diagram_id)}
                            />
                        }
                        <SRD.DiagramWidget
                            diagramEngine={this.state.engine}
                            allowLooseLinks={false}
                            locked={this.props.preview}
                        />
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Canvas
