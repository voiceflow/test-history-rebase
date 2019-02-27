import React, { Component } from 'react'
import * as SRD from './../../components/SRD/main.js'
import Menu from './Menu'
import Editor from './Editor'
import axios from 'axios'
import update from 'immutability-helper';
import { compose } from 'recompose'
// import Loader from './Loader'
import 'draft-js/dist/Draft.css'
import './../../components/SRD/sass/main.css';
import './StoryBoard.css'

//HOCs
import {undo, redo} from './../../HOC/UndoRedo';

import ActionGroup from './ActionGroup'
import TemplateConfirmModal from './../../components/Modals/TemplateConfirmModal'
import HelpModal from './HelpModal'
import TestModal from './Test/TestModal'
import new_template from './../../../assets/templates/new'
import { ButtonGroup, Alert, ListGroup, ListGroupItem } from 'reactstrap'
import cloneDeep from 'lodash/cloneDeep'
import {convertDiagram} from './util'
import Spotlight from './Spotlight'
import { Toolkit } from './../../components/SRD/Toolkit'
import FlowBar from './FlowBar'
import DefaultModal from 'views/components/Modals/DefaultModal'
import ShortCuts from 'views/components/ShortCuts'
import Mousetrap from 'mousetrap'

import { BlockNodeModel } from './../../components/SRD/models/BlockNodeModel'
import { PointModel } from './../../components/SRD/models/PointModel'
import { BlockLinkFactory } from './../../components/SRD/factories/BlockLinkFactory'
import { BlockPortFactory } from './../../components/SRD/factories/BlockPortFactory'
import { BlockNodeFactory } from './../../components/SRD/factories/BlockNodeFactory'

import { SLOT_TYPES, ALLOWED_GOOGLE_BLOCKS } from 'Constants'

import { getIntentSlots } from 'Helper'
import Linter from './linter'
import { getUtterancesWithSlotNames, getSlotsForKeys } from '../../../util'
import randomstring from 'randomstring'
import { checkBlockDisabledLive } from './Blocks'

import { Prompt } from 'react-router'
import moment from 'moment'
import Upgrade from '../../components/Modals/MultiPlatformModalContent.jsx';

// import Joyride from 'react-joyride'
// import { rejects } from 'assert'
const NLC = require('natural-language-commander')
const _ = require('lodash')
const line_color = '#D1D8E2'
const line_width = 2.5
const toolkit = new Toolkit()

const generateID = () => {
    return "xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0
        const v = c === "x" ? r : (r & 0x3) | 0x8
        return v.toString(16)
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
        this.copy = this.copy.bind(this);
        this.paste = this.paste.bind(this);
        this.handleTemplateChoice = this.handleTemplateChoice.bind(this)
        this.toggleTemplateConfirm = this.toggleTemplateConfirm.bind(this)
        // this.replaceWithTemplate = this.replaceWithTemplate.bind(this)
        this.combineValidation = this.combineValidation.bind(this)
        this.combineAppendValidation = this.combineAppendValidation.bind(this)
        this.combineNode = this.combineNode.bind(this)
        // this.createWithTemplate = this.createWithTemplate.bind(this)
        this.createFlowFromTemplate = this.createFlowFromTemplate.bind(this)
        this.onFlowRenamed = this.onFlowRenamed.bind(this)
        this.clickDiagram = this.clickDiagram.bind(this)
        this.toggleGoogle = this.toggleGoogle.bind(this)
        this.setCanFulfill = this.setCanFulfill.bind(this)
        this.updateFulfillmentOnDeletion = this.updateFulfillmentOnDeletion.bind(this)
        this.deleteNodeManually = this.deleteNodeManually.bind(this)
        this.mouseMove = this.mouseMove.bind(this)
        this.centerDiagram = this.centerDiagram.bind(this)
        this.toggleShortcuts = this.toggleShortcuts.bind(this)
        this.onIntentUpdate = this.onIntentUpdate.bind(this)
        this.updateLinter = this.updateLinter.bind(this)
        this.onUpdate = this.onUpdate.bind(this)

        this.forceRepaint = this.forceRepaint.bind(this)
        this.generateBlockMenu = this.generateBlockMenu.bind(this)
        this.appendCombineNode = this.appendCombineNode.bind(this);
        this.removeCombineNode = this.removeCombineNode.bind(this);
        this.undo = this.undo.bind(this)
        this.redo = this.redo.bind(this)
        this.canSave = this.canSave.bind(this)
        this.serialize = this.serialize.bind(this);
        this.setMousetrap = this.setMousetrap.bind(this)
        this.hasFlow = this.hasFlow.bind(this)
        this.lastModel = null
        // build diagram tree function from child
        this.buildDiagrams = null
        // preview mode
        // this.preview = !!this.props.preview

        var engine = new SRD.DiagramEngine()
        engine.registerLabelFactory(new SRD.DefaultLabelFactory())
        engine.registerNodeFactory(new BlockNodeFactory())
        engine.registerLinkFactory(new BlockLinkFactory(line_color, line_width, this.props.preview))
        engine.registerPortFactory(new BlockPortFactory())

        let open
        let diagram_name = ''

        // ONBOARDING
        this.onboarding = localStorage.getItem('onboarding')
        if (window.chmln){
            window.chmln.identify(window.user_detail.id, {
                email: window.user_detail.email,
                name: window.user_detail.name
            })
        }
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
            testing_modal: false,
            testing_info: false,
            variables: [],
            help: null,
            helpOpen: false,
            copy: null,
            currentProduct: null,
            user_modules: null,
            user_templates: [],
            email_templates: [],
            display_templates: [],
            diagram_level_intents: {
                alexa: new Set(),
                google: new Set()
            },
            confirm_info: null,
            default_templates: [],
            spotlight: false,
            keyboard_help: false,
            upgrade_modal: false
        }

        this.diagram_set = new Set()

        // SKILL IS LOADED HERE
        if(!this.props.preview){
            // this.loadProducts()
            // this.loadUserModules()
            this.onLoadTemplates()
        }
        this.onLoadDiagrams()
    }

    setMousetrap() {
        Mousetrap.reset()
        Mousetrap.bind(['shift+/'], this.toggleShortcuts)
        Mousetrap.bind(['ctrl+c', 'command+c'], this.copy)
        Mousetrap.bind(['ctrl+v', 'command+v'], this.paste)
        Mousetrap.bind(['ctrl+z', 'command+z'], this.undo)
        Mousetrap.bind(['ctrl+y', 'command+y', 'ctrl+shift+z', 'command+shift+z'], this.redo)
        Mousetrap.bind(['ctrl+s', 'command+s'], (e) => {
            e.preventDefault()
            if (!this.state.saved && !this.props.preview) {
                this.onSave()
            }
        })
        Mousetrap.bind('esc', () => (this.state.spotlight && this.setState({ spotlight: false })))
        Mousetrap.bind('space', (e) => {
            if (this.diagram_focus) {
                this.onDiagramUnfocus()
                this.setState({ spotlight: true })
                e.preventDefault()
                e.stopPropagation()
            }
        })
    }
    componentDidMount() {
        this.setMousetrap()
        this.props.setOnSave(this.onSave)
        // AUTOSAVE EVERY 10 SECONDS
        if(!this.props.preview && this.state.skill && this.state.skill.skill_id && this.props.diagram_id && !window.error){
            this.interval = setInterval(()=>{
                if(this.lastModel){
                    var currentModel = JSON.stringify(this.serialize())
                    if(currentModel !== this.lastModel){
                        if(this.canSave(currentModel)){
                            this.tooBig = false
                            this.onSave()
                        }else{
                            if(!this.tooBig){
                                this.tooBig = true
                                this.props.onError('Your flow is too large to be saved - Delete blocks and use sub-flows to reduce size')
                            }
                        }
                    }
                }
            }, 10000)
        }
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
        if(!this.props.preview && this.state.skill && this.state.skill.skill_id && this.props.diagram_id && !window.error){
            this.onSave(false)
        }
        Mousetrap.reset()
        if(this.interval){
            clearInterval(this.interval)
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
        if(this.state.diagrams.length !== this.diagram_set.size){
            this.diagram_set = new Set(this.state.diagrams.map(d => d.id))
        }
    }

    serialize(){
        let serialize = this.state.engine.getDiagramModel().serializeDiagram()
        _.map(serialize.nodes, node => {
            if (!_.isEmpty(node.combines)) {
                let isHome = node.extras.type === 'story'
                if(!isHome) node.extras.nextID = node.combines[0].id
                node.combines = _.map(node.combines, (combine, idx) => {
                    if (combine.parentCombine){
                        delete combine.parentCombine
                    }
                    if(!isHome){
                        if (idx !== node.combines.length - 1 && combine.extras) {
                            combine.extras.nextID = node.combines[idx + 1].id
                        } else {
                            _.forEach(combine.ports, cp => {
                                if (!cp.in) {
                                    if (_.find(node.ports, np => np.id === cp.id)) {
                                        cp.links = _.find(node.ports, np => np.id === cp.id).links;
                                    }
                                }
                            })
                        }
                    }
                    return combine.serialize ? combine.serialize() : combine
                })
            } else {
                delete node.combines
            }
        })
        return serialize
    }

    canSave(currentModel){
        // Get the size of the diagram in bytes
        const size = (new TextEncoder('utf-8').encode(currentModel)).length
        // If the size is too large warn the user
        return size < 399000
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

    copy(){
        this.setState({
            copy: this.state.engine.getSuperSelect()
        })
    }

    paste() {
        if(this.state.copy){
            let event = {
                clientX: this.mouseX,
                clientY: this.mouseY
            }
            var point = this.state.engine.getRelativeMousePoint(event)
            this.copyNode(this.state.copy, { x: point.x - (this.state.copy.name.length * 4.5 + 40), y: point.y -30})
        }
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

    // replaceWithTemplate(module_id){
    //     this.setState({
    //         template_confirm: null
    //     })

    //     axios.get(`/marketplace/template/${module_id}/`, {
    //         diagram_id: this.props.diagram_id
    //     })
    //     .then(res => {
    //         this.loadDiagram(res.data)
    //     })
    //     .catch(err => {
    //         console.log(err.response)
    //         this.setState({
    //             saving: false
    //         })
    //         this.props.onError('Error retrieving template')
    //     })
    // }

    createFlowFromTemplate(module_id){
        if(this.props.preview) return

        var engine = this.state.engine
        var type = 'flow'

        axios.get(`/marketplace/template/${module_id}/`, {
            diagram_id: this.props.diagram_id
        })
        .then(res => {
            var node = new BlockNodeModel(type.charAt(0).toUpperCase() + type.substr(1), null, toolkit.UID())
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

    undo(e) {
        if (!_.isEmpty(this.props.undoEvents) && !this.state.engine.getDiagramModel().locked){
            let recent = _.clone(_.last(this.props.undoEvents));
            if (recent.eventType === 'remove'){
                _.forEach(recent.node, n => {
                    if (n instanceof BlockNodeModel){
                        n.parentCombine = null;
                        this.state.engine.getDiagramModel().addNode(n)
                    }});
            } else {
                _.forEach(recent.node, n => n instanceof BlockNodeModel && n.remove());
            }
            this.state.engine.getDiagramModel().clearSelection();
            this.props.addRedo(recent)
            this.props.removeUndo();
        }
        e.preventDefault()
    }

    redo(e){
        if (!_.isEmpty(this.props.redoEvents) && !this.state.engine.getDiagramModel().locked){
            let recent = _.last(this.props.redoEvents);
            if (recent.eventType === 'remove') {
                _.forEach(recent.node, n => n instanceof BlockNodeModel && n.remove());
            } else {
                this.state.engine.getDiagramModel().clearSelection()
                _.forEach(recent.node, n => n instanceof BlockNodeModel && this.state.engine.getDiagramModel().addNode(n));
            }
            this.state.engine.getDiagramModel().clearSelection();
            this.props.addUndo(recent.node, recent.eventType);
            this.props.removeRedo();
        }
        e.preventDefault()
    }

    // createWithTemplate(module){
    //     axios.get(`/marketplace/template/${module.module_id}`, {
    //         diagram_id: this.props.diagram_id
    //     })
    //     .then(res => {
    //         this.loadDiagram(res.data)
    //     })
    //     .catch(err => {
    //         console.log(err.response)
    //         this.setState({
    //             saving: false
    //         })
    //         this.props.onError('Error retrieving template')
    //     })
    // }
            
    removeNode(selectedNode = null){
        let selected = selectedNode ? selectedNode : this.state.engine.getSuperSelect()
        if(!checkBlockDisabledLive(this.props.live_mode, selected.extras.type)){
            this.state.engine.stopMove()
            if (selected.extras && selected.extras.type === 'god'){
                this.props.onConfirm({
                    warning: true,
                    text: <Alert color="danger" className="mb-0">WARNING: This action can not be undone, <i>{selected.name}</i> can not be recovered</Alert>,
                    confirm: () => selected.remove()
                })
            } else if(selected){
                if (this.props.undoEvents.length >= 10){
                    this.props.shiftUndo()
                }
                this.props.addUndo([selected], 'remove')
                this.props.clearRedo()
                selected.remove()
            }
        } else {
            this.props.onError('Cannot delete blocks that would alter the interaction model in live version editing')
        }
    }
    // copy individual node
    copyNode(newNode = null, pos = null) {
        let selected = newNode ? newNode : this.state.engine.getSuperSelect()
        let amountZoom = this.state.engine.getDiagramModel().getZoomLevel() / 100;
        if(selected.extras.type !== 'story'){
            let engine = this.state.engine
            engine.stopMove()

        var node = new BlockNodeModel(selected.name + ' copy', null, toolkit.UID())
        node.extras = cloneDeep(selected.extras)
        if (selected.extras.type === 'god') {
            let newCombines = []
            let lastPorts;
            let inPorts;
            _.map(selected.combines, (combineNode, idx) => {
                let newCombineNode = new BlockNodeModel(combineNode.name, null, toolkit.UID())
                newCombineNode.extras = cloneDeep(combineNode.extras);
                newCombineNode.x = combineNode.x + 30;
                newCombineNode.y = combineNode.y + 30;
                let ports = combineNode.ports

                for (var name in ports) {
                    let port = ports[name]
                    port.in ? newCombineNode.addInPort(port.label): newCombineNode.addOutPort(port.label).setMaximumLinks(1)
                }
                _.map(newCombineNode.ports, p => p.parent = node);
                lastPorts = newCombineNode.getOutPorts()
                newCombines.push(newCombineNode)
                newCombines[idx].parentCombine = node;
                if (idx === 0) {
                    inPorts = newCombineNode.getInPorts()
                }
            })
            node.combines = newCombines
            _.last(node.combines).isLast = true
            node.ports = _.concat(lastPorts, inPorts);
        }
            let ports = selected.getPorts()
            if (node.extras.type !== 'god'){
                for (var name in ports) {
                    let port = ports[name]
                    port.in ? node.addInPort(port.label) : node.addOutPort(port.label).setMaximumLinks(1)
                }
            }

            node.x = pos ? pos.x : selected.x + 30
            node.y = pos ? pos.y : selected.y + 30
            if (!_.isEmpty(node.combines)){
              let totalHeight = 40;
				_.forEach(node.combines, (c, idx) => {
					if (!(c instanceof String) && c.id !== node.id) {
						c.x = node.x + 10;
						c.y = node.y + totalHeight;
						if (c.height) {
							totalHeight = totalHeight + c.height /amountZoom
						} else {
							totalHeight = totalHeight + 40
						}
					}
				});
            }
            engine.getDiagramModel().clearSelection()
            node.setSelected()
            engine.setSuperSelect(node)
            engine.getDiagramModel().addNode(node)
            this.addRemoveListener(node)
            if (this.props.undoEvents.length >= 10) {
                this.props.shiftUndo()
            }
            this.props.addUndo([node], 'copy')
            this.props.clearRedo()
            this.setState({
                engine: engine,
            })
        }
    }

    appendCombineNode(node){
        let idx = _.findIndex(node.parentCombine.combines, c => c.id === node.id);
        let amountZoom = this.state.engine.getDiagramModel().getZoomLevel() / 100;
        let engine = this.state.engine;
        if (idx !== -1 && this.combineAppendValidation(node)){
            engine.stopMove()

            var newNode = new BlockNodeModel(node.name + ' copy', null, toolkit.UID())
            newNode.extras = cloneDeep(node.extras)
            var name
            let ports = node.ports;
            for (name in ports) {
                let port = ports[name]
                port.in ? newNode.addInPort(port.label) : newNode.addOutPort(port.label).setMaximumLinks(1)
            }
            _.map(newNode.ports, p => p.parent = newNode);
            node.parentCombine.combines.splice(idx + 1, 0, newNode.serialize())
            if (idx === node.parentCombine.combines.length){
                let parentPorts = node.parentCombine.getOutPorts()
                for (name in parentPorts) {
                    let parentPort = parentPorts[name]
                    if (!parentPort.in) {
                        node.parentCombine.removePort(node.parentCombine.ports[name])
                    }
                }
                let lastPorts = newNode.getOutPorts();
                node.parentCombine.ports.push(lastPorts);
            } else {
                _.forEach(node.parentCombine.getOutPorts(), port => {
                    if (!port.in && !_.isEmpty(port.links)) {
                        let pointIdx = _.findIndex(_.first(_.values(port.links)).points, p => p.parent.sourcePort.id === port.id)
                        let point = _.first(_.values(port.links)).points[pointIdx]
                        if (point instanceof PointModel) {
                            _.first(_.values(port.links)).points[pointIdx].updateLocation({ x: point.x, y: point.y + 40 });
                            this.repaint()
                        }

                    }
                })
            }
            let totalHeight = 40;
            _.forEach(node.parentCombine.combines, (c, idx) => {
                if (!(c instanceof String) && c.id !== node.parentCombine.id) {
                    c.x = node.parentCombine.x + 25;
                    c.y = node.parentCombine.y + totalHeight;
                    if (c.height) {
                        totalHeight = totalHeight + c.height / amountZoom
                    } else {
                        totalHeight = totalHeight + 40
                    }
                }
            });
            engine.setSuperSelect(node);
            this.forceRepaint()
        }
    }

    removeCombineNode(node){
        const removeNode = () => {
            let nodeIdx
            let diagramEngine = this.state.engine
            let amountZoom = diagramEngine.getDiagramModel().getZoomLevel() / 100;
            let combineBlock = node.parentCombine
            _.remove(combineBlock.combines, (c, idx) => {
                if (c.id === node.id) {
                    nodeIdx = idx;
                    diagramEngine.setSuperSelect(null)
                    return true;
                }
            })
            
            if(combineBlock.extras.type !== 'god') return this.forceRepaint()
            let lastNode = new BlockNodeModel().deSerialize(_.last(combineBlock.combines), diagramEngine);
            if (nodeIdx === combineBlock.combines.length) {
                _.forEach(combineBlock.ports, p => {
                    if (!p.in) {
                        combineBlock.removePort(p);
                    }
                })
                _.forEach(lastNode.ports, p => {
                    if (!p.in) {
                        combineBlock.ports[p.name] = p
                    }
                })
            } else {
                _.forEach(node.parentCombine.getOutPorts(), port => {
                    if (!port.in && !_.isEmpty(port.links)) {
                        let pointIdx = _.findIndex(_.first(_.values(port.links)).points, p => p.parent.sourcePort.id === port.id)
                        let point = _.first(_.values(port.links)).points[pointIdx]
                        if (point instanceof PointModel) {
                            _.first(_.values(port.links)).points[pointIdx].updateLocation({ x: point.x, y: point.y - 40 });
                            this.repaint()
                        }

                    }
                })
            }
            if (combineBlock.combines.length === 1) {
                let removed = new BlockNodeModel().deSerialize(lastNode, diagramEngine);
                diagramEngine.getDiagramModel().addNode(removed)
                removed.parentCombine = null;
                removed.extras.nextID = null;
                combineBlock.remove();
            }
            let totalHeight = 40;
            _.forEach(node.parentCombine.combines, (c, idx) => {
                if (!(c instanceof String) && c.id !== node.parentCombine.id) {
                    c.x = node.parentCombine.x + 25;
                    c.y = node.parentCombine.y + totalHeight;
                    if (c.height) {
                        totalHeight = totalHeight + c.height / amountZoom
                    } else {
                        totalHeight = totalHeight + 40
                    }
                }
            });
            diagramEngine.setSuperSelect(null)
            this.forceRepaint()
        }
        if(node.extras.type === 'command'){
            if(this.props.diagram_id === this.props.skill.diagram && node.parentCombine){
                // Do not allow help/stop be deleted
                try{
                    const intents = ['AMAZON.HelpIntent', 'AMAZON.StopIntent']
                    for(var intent of intents){
                        if(node.extras['alexa'].intent.value === intent){
                            let count = 0
                            for(var c_node of node.parentCombine.combines){
                                try{(c_node.extras['alexa'].intent.value === intent && count++)}catch(e){}
                            }
                            if(count < 2){
                                this.props.onConfirm({
                                    text: <Alert className="mb-0"><b>{intent}</b> is required by default</Alert>,
                                    confirm: _.noop
                                })
                                return
                            }
                            break
                        }
                    }
                }catch (e){}
            }

            this.props.onConfirm({
                warning: true,
                text: <Alert color="danger" className="mb-0">Remove this command?</Alert>,
                confirm: removeNode
            })
        }else{
            removeNode()
        }
    }

    combineValidation(current, target){
        if (current.parentCombine || target.parentCombine) {
            return false;
        }
        if (current.extras.type === 'god' && target.extras.type === 'god'){
            return false;
        }
        if (!_.isEmpty(target.combines) && _.last(target.combines).extras){
            switch(_.last(target.combines).extras.type){
                case 'exit':
                    switch(current.extras.type){
                        case 'exit':
                            return false;
                        case 'choice':
                            return false;
                        case 'stream':
                            return false;
                        case 'interaction':
                            return false;
                        case 'if':
                            return false;
                        case 'random':
                            return false;
                        default:
                            break;
                    }
                    break;
                case 'choice':
                    switch(current.extras.type){
                        case 'choice':
                            return false;
                        case 'exit':
                            return false;
                        case 'stream':
                            return false;
                        case 'interaction':
                            return false
                        case 'if':
                            return false;
                        case 'random':
                            return false;
                        default:
                            break;
                    }
                    break;
                case 'stream':
                    switch(current.extras.type){
                        case 'stream':
                            return false;
                        case 'exit':
                            return false;
                        case 'choice':
                            return false;
                        case 'interaction':
                            return false;
                        case 'if':
                            return false;
                        case 'random':
                            return false;
                        default:
                            break;
                    }
                    break;
                case 'interaction':
                    switch(current.extras.type){
                        case 'interaction':
                            return false;
                        case 'exit':
                            return false;
                        case 'choice':
                            return false;
                        case 'stream':
                            return false;
                        case 'if':
                            return false;
                        case 'random':
                            return false;
                        default:
                            break;
                    }
                    break;
                case 'if':
                    switch(current.extras.type){
                        case 'if':
                            return false;
                        case 'exit':
                            return false;
                        case 'choice':
                            return false;
                        case 'stream':
                            return false;
                        case 'interaction':
                            return false;
                        case 'random':
                            return false;
                        default:
                            break;
                    }
                break;
                case 'random':
                    switch(current.extras.type){
                        case 'if':
                            return false;
                        case 'exit':
                            return false;
                        case 'choice':
                            return false;
                        case 'stream':
                            return false;
                        case 'interaction':
                            return false;
                        case 'random':
                            return false;
                        default:
                            break;
                    }
                break;
            default:
                break;
            }
        }
        switch(target.extras.type){
            case 'story':
                return false;
            case 'flow':
                return false;
            case 'intent':
                return false;
            case 'comment':
                return false;
            case 'command':
                return false;
            default:
                break;
        }
        switch(current.extras.type){
            case 'god':
                return false;
            case 'story':
                return false;
            case 'flow':
                return false;
            case 'intent':
                return false;
            case 'comment':
                return false;
            case 'command':
                return false;
            default:
                return true;
        }
    }

    combineAppendValidation(current){
        switch(current.extras.type){
            case 'exit':
                return false;
            case 'interaction':
                return false;
            case 'choice':
                return false;
            case 'if':
                return false;
            case 'stream':
                return false;
            case 'random':
                return false;
            default:
                return true;
        }
    }
    combineNode(e = null) {
      let current = this.state.engine.getSuperSelect();
       let amountZoom = this.state.engine.getDiagramModel().getZoomLevel() / 100
        var nodeElement = e ? toolkit.closest(e.target, ".node[data-nodeid]") : null;
        let element = nodeElement ? this.state.engine.getDiagramModel().getNode(nodeElement.getAttribute("data-nodeid")) : null;
        var name
      _.map(_.values(this.state.engine.getDiagramModel().getNodes()), (target_node, idx) => {
        if (current && target_node){
          if (target_node.id === current.id){
              return;
          }
          if(current.parentCombine || (element && element.extras && element.extras.type === 'god')) {
              let parent = current.parentCombine ? current.parentCombine : element
             let tempIdx = _.findIndex(parent.combines, c =>{
                 return c === 'temp'
              })
             if (tempIdx >=0){
                 let parentPorts = parent.ports
                 let firstNode = _.head(_.filter(parent.combines, c => c !== 'temp'));
                 let lastNode = _.last(_.filter(parent.combines, c => c !== 'temp'));
                 if (tempIdx === 0){
                     firstNode = current;
                 } else if (tempIdx === parent.combines.length-1){
                     lastNode = current;
                 }
                 current.x = parent.x + 10;
                 firstNode = new BlockNodeModel().deSerialize(firstNode, this.state.engine);
                 lastNode = new BlockNodeModel().deSerialize(lastNode, this.state.engine);
                 let isValid = current;
                 if (tempIdx <= parent.combines.length && current.parentCombine) {
                     if (_.last(current.parentCombine.combines) !== 'temp') {
                         isValid = _.last(current.parentCombine.combines)
                     }
                 }
                 if ((tempIdx <= parent.combines.length && current.parentCombine && this.combineAppendValidation(isValid)) || (!current.parentCombine && tempIdx + 1 === parent.combines.length)){
                    for (name in parentPorts){
                        let parentPort = parentPorts[name]
                        if (parentPort.in){
                            if (_.find(firstNode.ports, cp => cp.in)){
                                let portIdx = _.find(firstNode.ports, cp => cp.in)
                                portIdx.parent = parent
                                parentPort = portIdx;
                            } else {
                                parent.removePort(parent.ports[name])
                            }
                        } else {
                            parent.removePort(parent.ports[name])
                        }
                    }
                     if (tempIdx <= parent.combines.length && current.parentCombine){
                        _.forEach(lastNode.ports, cp => {
                            if (!cp.in){
                                cp.parent = parent
                                parent.ports[cp.name] = cp;
                            }
                        })
                    } else {
                        _.forEach(current.getOutPorts(), cp => {
                            if (!cp.in) {
                                cp.parent = parent
                                parent.ports[cp.name] = cp;
                            }
                        }) 
                    }
                 } else {
                     _.forEach(parent.getOutPorts(), port => {
                         if (!port.in && !_.isEmpty(port.links) && !current.parentCombine) {
                             let pointIdx = _.findIndex(_.first(_.values(port.links)).points, p => p.parent.sourcePort.id === port.id)
                             let point = _.first(_.values(port.links)).points[pointIdx]
                             if (point instanceof PointModel) {
                                 _.first(_.values(port.links)).points[pointIdx].updateLocation({ x: point.x, y: point.y + 40 });
                                 this.repaint()
                             }

                         }
                     })
                 }
                let parentIn = _.find(parent.ports, cp => cp.in);
                let firstNodeIn = _.find(firstNode.ports, cp => cp.in);
                if (!parentIn && firstNodeIn){
                    parent.ports[firstNodeIn.name] = firstNodeIn
                }
                parent.combines[tempIdx] = current.serialize();
                let totalHeight = 40;
                _.forEach(parent.combines, (c, idx) => {
                    if (!(c instanceof String) && c.id !== parent.id) {
                        c.x = parent.x + 25;
                        c.y = parent.y + totalHeight;
                        if (c.height) {
                            totalHeight = totalHeight + c.height
                        } else {
                            totalHeight = totalHeight + 40
                        }
                    }
                });
                current.remove();
                this.state.engine.getDiagramModel().clearSelection()
                this.state.engine.setSuperSelect(parent)
                this.state.engine.enableRepaintEntities([parent]);
                this.state.engine.repaintCanvas(false);
                return;
             }
          }
          target_node.updateDimensions(this.state.engine.getNodeDimensions(target_node));
          if (_.includes(this.state.engine.diagramModel.nodes, c => c.id === current.id)) {
            current.updateDimensions(this.state.engine.getNodeDimensions(current));
          }
          let overlapX = (current.x >= target_node.x && current.x <= target_node.x+target_node.width) || (current.x+current.width >= target_node.x && current.x+current.width <= target_node.x+target_node.width);
          let overlapY = (current.y >= target_node.y && current.y <= target_node.y+target_node.height/amountZoom) || (current.y+current.height >= target_node.y && current.y+current.height <= target_node.y+target_node.height/amountZoom)
          if (overlapX && overlapY && this.combineValidation(current, target_node) && !e) {
            let selected = this.state.engine.getSuperSelect()
            let engine = this.state.engine
            let targetNode = target_node
            var node;
            if (targetNode.extras && targetNode.extras.type === 'god'){
            if (!_.some(targetNode.combines, c => c.id === current.id) && (this.combineAppendValidation(current) || this.combineAppendValidation(_.last(targetNode.combines)))){	
                selected.parentCombine = _.clone(target_node)		
                let selected_ports = selected.getPorts()	
                let target_ports = targetNode.getPorts()
                // var name	
                for (name in target_ports) {	
                    let port = target_ports[name]	

                     if (port.in) {	
                        port.parent = target_node	
                    target_node.ports[name] = port	
                    } else if (this.combineAppendValidation(_.last(targetNode.combines))) {	
                        target_node.removePort(target_node.ports[name])	
                    }	
                    if (!port.in && !_.isEmpty(port.links)){	
                        let pointIdx = _.findIndex(_.first(_.values(port.links)).points, p => p.parent.sourcePort.id === port.id)	
                        let point = _.first(_.values(port.links)).points[pointIdx]	
                        if (point instanceof PointModel){	
                            _.first(_.values(port.links)).points[pointIdx].updateLocation({x: point.x, y: point.y + 40});	
                            this.repaint()	
                        }	

                     }	
                }	
                for (name in selected_ports) {	
                    let port = selected_ports[name]	
                    if (!port.in && this.combineAppendValidation(_.last(targetNode.combines))) {	
                        port.parent = target_node	
                        target_node.ports[name] = port	
                    }	
                }	
                if (_.isNull(selected.parentCombine)){	
                    selected.remove();	
                }	
                if (!this.combineAppendValidation(_.last(targetNode.combines))) {	
                    target_node.combines.splice(target_node.combines.length - 1, 0, selected.serialize())	
                } else {	
                    target_node.combines.push(selected.serialize());	
                }
                let totalHeight = 40;
                _.forEach(current.parentCombine.combines, (c, idx) => {	
                    if (!(c instanceof String) && c.id !== current.parentCombine.id) {	
                        c.x = current.parentCombine.x + 25;	
                        c.y = current.parentCombine.y + totalHeight;	
                        if (c.height) {	
                            totalHeight = totalHeight + c.height / amountZoom	
                        } else {	
                            totalHeight = totalHeight + 40
                        }	
                    }	
                });	
                targetNode.height = targetNode.height + 40;	
                selected.remove()	
                engine.getDiagramModel().clearSelection()	
                engine.setSuperSelect(targetNode)	
                this.state.engine.repaintCanvas(false)	
                }	
            } else {
              node = new BlockNodeModel('Combine Block', null, toolkit.UID())
              node.extras.type = "god"
              if (!this.combineAppendValidation(targetNode)) {
                  let temp = selected;
                  selected = targetNode;
                  targetNode = temp
              }
              // node.ports = {}
              let selected_ports = selected.getPorts()
              let target_ports = targetNode.getPorts()

              for (name in selected_ports) {
                let port = selected_ports[name]
                // port.parent=null
                if (!port.in) {
                    port.parent = node
                  node.ports[name] = _.clone(port);
                }
              }
              for (name in target_ports) {
                let port = target_ports[name]
                // port.parent = null
                if (port.in) {
                  port.parent = node
                  node.ports[name] = _.clone(port)
                }
              }
              targetNode.parentCombine = node;
              selected.parentCombine = node;
              node.x = targetNode.x
              node.y = targetNode.y
              targetNode.x = targetNode.x + 25
              targetNode.y = targetNode.y + 40
              selected.x = targetNode.x
              selected.y = targetNode.y + 40
              node.combines = [targetNode]
              node.combines.push(selected);
              if(selected && targetNode){
                  selected.remove()
                  targetNode.remove()
              }
              node.combines = _.map(node.combines, nc => nc.serialize())
              node.setSelected()
              engine.getDiagramModel().clearSelection()
              engine.setSuperSelect(node)
              engine.getDiagramModel().addNode(node)
              this.state.engine.enableRepaintEntities([node]);
              this.state.engine.repaintCanvas(false);
            }
            this.state.engine.enableRepaintEntities([current]);
            this.state.engine.repaintCanvas(false);
            this.setState({
                engine: engine
            })
          }
        }
      })
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

        if (flow_id === this.props.diagram_id && !this.props.preview) {
            window.saveCB = () => {
                copy(false)
            }
            this.onSave()
        } else {
            copy(true)
        }
    }
    
    deleteFlow(flow_id) {
        this.props.onConfirm({
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
                    return this.props.onConfirm({
                        text: 'Flow names must be unique',
                        confirm: () => this.setState({
                            confirm: null
                        })
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
        if (!_.isEmpty(selected) && _.first(selected).extras && _.first(selected).extras.type ==='story'){
            selected = [engine.getSuperSelect()]
        }
        if (selected.length === 1 && selected[0]) {
            if(selected[0].extras.type === 'comment'){
                this.diagram_focus=false
            }else{
                this.setState({
                    open: true
                })
                if (selected[0].combines && selected[0].combines.length === 0){
                    engine.setSuperSelect(selected[0])
                }
            }
        } else if (selected.length === 0) {
            engine.setSuperSelect(null)
            let model = engine.getDiagramModel()
            let nodes = model.getNodes()
            for (let key in nodes) {
                if (nodes[key].extras.type === 'comment' && nodes[key].name.trim().length === 0) {
                    model.removeNode(nodes[key].getID())
                    this.forceUpdate()
                }
            }
        }
        this.setState({
            blockMenu: null
        })
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

    forceRepaint(){
        this.forceUpdate()
    }

    onSave(state=true) {
        if (this.saving) return
        this.saving = true
        try {
            if (!this.props.preview){
                state && this.setState({ saving: true })
                let serialize = this.serialize()
                var data = JSON.stringify(serialize)

                let sub_diagrams = []

                serialize.nodes.forEach(node => {
                    if(node.extras.diagram_id){
                        sub_diagrams.push(node.extras.diagram_id)
                    }else if(node.extras.type === 'story' && Array.isArray(node.combines)){
                        node.combines.forEach(combine_node => {
                            let extras = combine_node.extras[this.state.skill.platform]
                            if(extras && extras.diagram_id){
                                sub_diagrams.push(extras.diagram_id)
                            }
                        })
                    }
                })

                if(state){
                    // UPDATE SKILL GLOBALS HOTFIX
                    let skill = this.state.skill;
                    skill.global = this.state.skill.global
                    this.props.updateSkill(skill)

                    // UPDATE DIAGRAM STRUCTURE
                    let diagrams = this.state.diagrams
                    for (var i = 0; i < diagrams.length; i++) {
                        if(diagrams[i].id === serialize.id){
                            diagrams[i].sub_diagrams = sub_diagrams
                        }
                    }
                    state && this.setState({
                        diagrams: diagrams
                    }, () => {
                        if(this.buildDiagrams !== null){
                            this.buildDiagrams(this.props.diagram_id)
                        }
                    })
                }

                var diagram = {
                    title: this.state.diagram_name,
                    variables: this.state.variables,
                    data: data,
                    skill: this.state.skill.skill_id,
                    sub_diagrams: JSON.stringify(sub_diagrams),
                    global: this.state.skill.global
                }
                const s = this.state.skill;
                const save_skill_intents = new Promise((resolve, reject) => {
                    axios.patch('/skill/' + s.skill_id + '?intents=true', {
                        intents: JSON.stringify(s.intents),
                        slots: JSON.stringify(s.slots),
                        fulfillment: JSON.stringify(s.fulfillment),
                        account_linking: JSON.stringify(s.account_linking),
                        platform: s.platform
                    })
                    .then(res => {
                        resolve()
                    })
                    .catch(err => {
                        reject(err)
                    })
                })

                const save_diagram = axios.post(`/diagram`, diagram)
                
                Promise.all([save_skill_intents, save_diagram]).then(res => {
                    this.saving = false
                    this.lastModel = data
                    state && this.setState({
                        saving: false,
                        saved: true
                    })
                    if(typeof window.saveCB === "function"){
                        window.saveCB(serialize.id)
                        window.saveCB = null
                    }
                }).catch(rej_err => {
                    this.saving = false
                    state && this.setState({
                        saving: false
                    }) && this.props.onError('Error Saving Project')
                    if(typeof window.saveCB === "function"){
                        window.saveCB(null)
                        window.saveCB = null
                    }
                })
            }
        } catch (e) {
            this.saving = false
            console.log(e)
            state && this.props.onError('Error Saving - Project Structure (Check Logs)')
            if(typeof window.saveCB === "function"){
                window.saveCB(null)
                window.saveCB = null
            }
        }
    }

    loadDiagram(diagram, diagram_id) {
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
            diagram_json.id = diagram_id
            this.lastModel = JSON.stringify(diagram_json)

            // This should not happen
            if(diagram_json.nodes.length === 0){
                diagram_json = new_template
            }
            engine.setSuperSelect(null)
            model.deSerializeDiagram(diagram_json, engine)
            model.addListener({ linksUpdated: this.unsave })
            model.addListener({ nodesUpdated: this.unsave })

            const diagram_level_intents = {
                alexa: new Set(),
                google: new Set()
            }
            
            const makeNodeMultiPlatform = (type, node) => {
                if (type === 'intent' || type === 'jump' || type === 'interaction' || type === 'command') {
                    if (!node.extras.google && !node.extras.alexa) {

                        if (node.extras.choices) {
                            node.extras.alexa = _.cloneDeep(_.pick(node.extras, ['choices']))

                            let g_choices =  _.cloneDeep(node.extras.alexa.choices)
                            g_choices = g_choices.map((e) => {return {intent: null, mappings: [], key: randomstring.generate(12), open: true}})

                            node.extras.google = {
                                choices: g_choices,
                            }
                            delete node.extras.choices
                            delete node.extras.choices_open
                        } else if (node.extras.intent) {
                            node.extras.alexa = _.cloneDeep(_.pick(node.extras, ['intent', 'mappings', 'resume', 'end', 'diagram_id']))
                            node.extras.google = {
                                intent: null,
                                mappings: [],
                                resume: node.extras.alexa.resume,
                                end: node.extras.alexa.end,
                                diagram_id: node.extras.alexa.diagram_id
                            }
                            delete node.extras.intent
                            delete node.extras.mappings
                            delete node.extras.resume
                            delete node.extras.end
                            delete node.extras.diagram_id
                        }
                    }
                    if (node.extras.alexa && node.extras.google) {
                        const has_intents = (node.extras.alexa.intent !== undefined) || (node.extras.google.intent !== undefined)
                        if ((type === 'intent' && has_intents) || (type === 'jump' && has_intents)) {
                            if (node.extras.google.intent) {
                                diagram_level_intents.google.add(node.extras.google.intent.key)
                            }
                            if (node.extras.alexa.intent) {
                                diagram_level_intents.alexa.add(node.extras.alexa.intent.key)
                            }
                        }
                    }
                }
            }

            var nodes = model.getNodes()
            for (let key in nodes) {
                const node = nodes[key]
                const type = node.extras.type
                this.addRemoveListener(node)

                if (Array.isArray(node.combines) && node.combines.length !== 0) {
                    node.combines.forEach(n => {
                        if (typeof n !== 'object') return
                        if (this.state.skill.platform === 'google') {
                            n.fade = !ALLOWED_GOOGLE_BLOCKS.includes(n.extras.type)
                        } else {
                            n.fade = false
                        }
                        makeNodeMultiPlatform(n.extras.type, n)
                    })
                } else {
                    if (this.state.skill.platform === 'google') {
                        nodes[key].fade = !ALLOWED_GOOGLE_BLOCKS.includes(type)
                    } else {
                        nodes[key].fade = false
                    }
                    makeNodeMultiPlatform(type, node)
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
                loading_diagram: false,
                variables: variables,
                diagram_level_intents: diagram_level_intents
            })

            this.setState({ saved: true })
            this.updateLinter(true)
            this.onIntentUpdate()
        } else {
            this.props.onError('Could Not Open Project - Corrupted File')
        }
    }

    toggleGoogle() {

        if (window.user_detail.admin === -1) { // Multiplatform paywall soft-disable
            this.setState({
                upgrade_modal: true
            })
            return
        }

        const skill = this.state.skill
        let platform = skill.platform === 'google' ? 'alexa' : 'google'
        skill.platform = platform

        this.setState({
            skill: skill
        })
        this.updateGoogleFade()
        this.updateLinter()
    }

    updateGoogleFade() {
        const engine = this.state.engine
        const model = engine.getDiagramModel()
        const nodes = model.getNodes()

        for (let key in nodes) {
            const node = nodes[key]
            const type = node.extras.type
            this.addRemoveListener(node)

            if (this.state.skill.platform === 'google') {
                if (type === 'god') {
                    node.combines.forEach(n => {
                        n.fade = !ALLOWED_GOOGLE_BLOCKS.includes(n.extras.type)
                    })
                } else {
                    nodes[key].fade = !ALLOWED_GOOGLE_BLOCKS.includes(type)
                }
            } else {
                if (type === 'god') {
                    node.combines.forEach(n => {
                        n.fade = false
                    })
                } else {
                    nodes[key].fade = false
                }
            }
        }
        engine.repaintCanvas()
        this.setState({
            engine: engine,
        })
    }

    updateLinter(force=false) {
        const engine = this.state.engine
        const model = engine.getDiagramModel()
        const nodes = model.getNodes()

        let update = false

        const lint = n => {
            if (typeof n !== 'object') return
            if (!n.linter) n.linter = []

            if (Linter[n.extras.type] && n.linter) {
                const res = Linter[n.extras.type](n, this.state.skill.platform)
                if (res) update = true
            }                
        }

        for (let key in nodes) {
            const node = nodes[key]
            const type = node.extras.type


            if (type === 'god') {
                node.combines.forEach(lint)
            } else {
                if (!node.linter) node.linter = []

                if (Linter[type] && node.linter) {
                    const res = Linter[type](node, this.state.skill.platform)
                    if (res) update = true
                }
            }
        }
        
        if (force || update) {
            this.setState({
                engine: engine,
            })
            engine.repaintCanvas()
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
            this.loadDiagram(res.data, diagram_id)
            if(!this.props.preview){
                localStorage.setItem('flow', `${this.state.skill.skill_id}/${diagram_id}`)
            }
            if(this.buildDiagrams !== null){
                this.buildDiagrams(diagram_id)
            }
        })
        .catch(err => {
            console.error(err)
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

            let built_in_slots = []

            SLOT_TYPES.forEach(s => {
                if (s.type.alexa) built_in_slots.push(s.type.alexa)
                if (s.type.google) built_in_slots.push(s.type.google)
            })
            built_in_slots.forEach(s => {
                const matcher = /[\s\S]*/
                nlc.addSlotType({
                    type: s,
                    matcher: matcher
                })
            })

            slot_mappings = {}
            this.state.skill.slots.forEach(slot => {

                if (slot.type.value && slot.type.value.toLowerCase() === 'custom') {
                    nlc.addSlotType({
                        type: slot.name,
                        matcher: slot.inputs
                    })
                }
            })

            this.state.skill.intents.forEach(intent => {
                let samples
                if (!intent.built_in) {
                    samples = getUtterancesWithSlotNames(intent.inputs, this.state.skill.slots)
                }
                const _slots = getSlotsForKeys(intent.inputs.map(input => input.slots), this.state.skill.slots, this.state.skill.platform)

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
            window.saveCB = (diagram_id) => {
                if(diagram_id === null){
                    this.setState({
                        testing_modal: false
                    })
                }else{
                    axios.post(`/diagram/${diagram_id}/test/publish`,{
                        intents: this.state.skill.intents,
                        slots: this.state.skill.slots,
                        platform: this.state.skill.platform
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
            }
            this.onSave()
        }
    }
    
    generateBlockMenu(e){
        var nodeElement = toolkit.closest(e.target, ".node[data-nodeid]")
        if (nodeElement && !this.props.preview){
            e.preventDefault()
            let engine = this.state.engine
            let node = this.state.engine.getDiagramModel()
                .getNode(nodeElement.getAttribute("data-nodeid"))
            engine.getDiagramModel().clearSelection();
            engine.setSuperSelect(node)
            this.setState({
                blockMenu: <React.Fragment>
                    <div style={{top: engine.getDiagramModel().getGridPosition(e.clientY - 100), left: engine.getDiagramModel().getGridPosition(e.clientX), cursor: 'pointer', position: 'absolute', zIndex: 10}}>
                        <ListGroup>
                            <ListGroupItem onClick={(e) => {
                                // e.stopPropagation();
                                node.setLocked(true);
                                node.selected = true;
                                node.edit = true;
                                this.setState({
                                    blockMenu: null
                                })
                            }}>Rename</ListGroupItem>
                            <ListGroupItem onClick={() => {
                                this.copyNode(node)
                                this.setState({
                                  blockMenu: null
                                });
                            }}>Copy Block</ListGroupItem>
                            <ListGroupItem onClick={() => {
                                this.removeNode(node)
                                this.setState({
                                  blockMenu: null
                                });
                                }}>Delete Block</ListGroupItem>
                        </ListGroup>
                    </div>
                </React.Fragment>
            })
        } else {
            this.setState({
                blockMenu: null,
            })
        }
    }
    // Create a new diagram from the flow block
    createDiagram(node, base_flow_name='New Flow', template=null, forCommand=false){
        this.setState({
            loading_diagram: true
        })

        let id = generateID()

        if (forCommand) {
            node.extras[this.state.skill.platform].diagram_id = id
        } else {
            node.extras.diagram_id = id
        }

        // save the current diagram
        window.saveCB = () => {
            this.saveCB = null
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
        }
        this.onSave()
    }

    addRemoveListener(node){
        const isRoot = this.state.skill.diagram === this.props.diagram_id
        const type = node.extras.type
        if (type === 'comment' || type === 'story') {
            node.clearListeners()
            node.addListener({ entityRemoved: e => e.stopPropagation()})
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

    hasFlow(diagram_id) {
        if(!diagram_id) return false
        return this.diagram_set.has(diagram_id)
    }

    enterFlow(new_diagram_id, save=true) {
        if(new_diagram_id !== this.props.diagram_id){
            this.setState({loading_diagram: true})
            if(save && !this.props.preview){
                window.saveCB = () => {
                    this.props.history.push(`/canvas/${this.state.skill.skill_id}/${new_diagram_id}`)
                }
                this.onSave()
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
        const extras = deleted_node.extras[this.state.skill.platform]

        if (extras.intent && extras.intent.key) {
            const key = extras.intent.key
            const new_value = false
            this.setCanFulfill(key, new_value)
            this.state.diagram_level_intents[this.state.skill.platform].delete(key)
        }
        this.deleteNodeManually(id)
    }

    onDeleteIntentNode(deleted_node) {
        const skill = this.state.skill
        const fulfillments = skill.fulfillment

        const extras = deleted_node.extras[skill.platform]
        const key = extras.intent ? extras.intent.key : null

        if (key && fulfillments[key]) {
            const confirm_info = {
                text: `CanfulfillIntent is enabled for the "${extras.intent.label}" intent. Deleting this intent will also delete any slot fulfillment values you have set for this intent.`,
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

        var node = new BlockNodeModel(name, null, toolkit.UID())

        if(type){
            if (type === 'choice') {
                node.addInPort(' ')
                node.addOutPort('else').setMaximumLinks(1)
                node.extras = {
                    choices: [],
                    inputs: []
                };
            } else if(type === 'exit'){
                node.addInPort(' ')
            } else if (type === 'interaction') {
                node.addInPort(' ');
                node.addOutPort('else').setMaximumLinks(1);
                node.extras = {
                    alexa: {
                        choices: []
                    },
                    google: {
                        choices: []
                    }
                }
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
                    alexa: {
                        intent: null,
                        mappings: [],
                        resume: false
                    },
                    google: {
                        intent: null,
                        mappings: [],
                        resume: false
                    }
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
                    update_on_change: false,
                    apl_commands: ''
                }
            } else if (type === 'stream') {
                node.addInPort(' ')
                node.addOutPort('next').setMaximumLinks(1)
                node.addOutPort('previous').setMaximumLinks(1)
                node.extras = {
                    audio: ''
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
            // node.updateDimensions(this.state.engine.getNodeDimensions(node))
            this.combineNode()
            this.setState({
                engine: engine,
                open: type !== 'comment'
            })
            this.updateLinter()
            this.updateGoogleFade()
        }
    }

    updateSkill(skill){
        this.setState({skill: skill})
        this.props.updateSkill(skill)
    }

    onIntentUpdate() {
        const intents = this.state.skill.intents
        const slots = this.state.skill.slots

        intents.forEach((intent, i) => {
            let is_google = false
            let is_alexa = false

            let intent_slots = getSlotsForKeys(intent.inputs.map(input => input.slots), slots)
            intent_slots.forEach(intent_slot => {
                const slot_type = intent_slot.type

                if (slot_type && slot_type.toLowerCase() !== 'custom') {
                    if (/AMAZON/.test(slot_type)) is_alexa = true
                    if (/^@sys\./.test(slot_type)) is_google = true
                }
            })
            let platform = null
            if (is_google && !is_alexa) platform = 'google'
            if (is_alexa && !is_google) platform = 'alexa'
            intents[i]._platform = platform
        })

        const skill = this.state.skill
        skill.intents = intents

        this.setState({
            skill: skill,
            saved: false
        })
        this.updateLinter()
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

    onUpdate() {
        this.updateLinter()
        this.unsave()
    }

    render() {
        const diagram = _.find(this.state.diagrams, d => d.id === this.props.diagram_id)
        return (
            <React.Fragment>
                <Prompt
                    message={()=>{
                        if(!this.canSave()){
                            return "This flow is too large to be saved, please remove blocks to reduce size - are you sure you would like to leave without saving?"
                        }
                        return true
                    }}
                />
                <DefaultModal
                    open={this.state.upgrade_modal}
                    header="Multi Platform Development"
                    toggle={() => this.setState({ upgrade_modal : !this.state.upgrade_modal })}
                    content={<Upgrade history={this.props.history} toggle={() => this.setState({ upgrade_modal : !this.state.upgrade_modal })}/>}
                    hideFooter={true}
                    noPadding={true}
                />
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
                        lastSave={(this.state.last_save ? "Last saved " + moment(this.state.last_save).fromNow() : "Save")}
                        setCB={(cb)=>{window.saveCB=cb}}
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
                        toggleGoogle={this.toggleGoogle}
                        platform={this.state.skill.platform}
                        updateSkill={this.updateSkill}
                        onTest={this.onTest}
                        has_live={this.props.has_live}
                        toggleLiveMode={this.props.toggleLiveMode}
                        live_mode={this.props.live_mode}
                        onSwapVersions={this.props.onSwapVersions}
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
                        platform={this.state.skill.platform}
                    />
                : null}
                {this.state.spotlight && <Spotlight addBlock={this.onDrop} cancel={()=>this.setState({spotlight: false})}></Spotlight>}
                <div id="canvas"
                  onMouseMove={this.mouseMove}
                  onMouseUp={this.combineNode}
                >
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
                        onConfirm={this.props.onConfirm}
                        copyFlow={this.copyFlow}
                        deleteFlow={this.deleteFlow}
                        renameFlow={this.renameFlow}
                        saving={this.state.saving}
                        preview={this.props.preview}
                        onError={this.props.onError}
                        platform={this.state.skill.platform}
                        live_mode={this.props.live_mode}
                        toggleUpgrade={this.props.toggleUpgrade}
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
                        diagramEngine={this.state.engine}
                        node={this.state.engine.getSuperSelect()}
                        onUpdate={this.onUpdate}
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
                        appendCombineNode={!this.props.preview ? this.appendCombineNode : _.noop()}
                        removeCombineNode={!this.props.preview ? this.removeCombineNode : _.noop()}
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
                        platform={this.state.skill.platform}
                        onIntentUpdate={this.onIntentUpdate}
                        live_mode={this.props.live_mode}
                        setCanvasEvents={this.setMousetrap}
                    />
                    <div
                        key={this.props.diagram_id}
                        id="diagram"
                        className={this.props.preview ? " no-padding" : ""}
                        onDrop={this.onDrop}
                        onDragOver={e => e.preventDefault()}
                        onMouseLeave={()=>this.diagram_focus=false}
                        // onClick={e => {
                        //     this.clickDiagram(e)
                        // }}
                        onContextMenu={this.generateBlockMenu}
                    >
                        <div id="widget-bar">
                            <ButtonGroup>
                                <button onClick={()=>this.zoom(1000)} className="white-circ round-left"><i className="far fa-plus"/></button>
                                <button onClick={()=>this.zoom(-1000)} className="white-circ round-right"><i className="far fa-minus"/></button>
                            </ButtonGroup>
                            <button className="white-circ ml-2" onClick={this.centerDiagram}><i className="fas fa-map-marker-alt"></i></button>
                            <button className="white-circ ml-2" onClick={() => {this.setState({keyboard_help: true})}}><i className="fas fa-keyboard"></i></button>
                        </div>
                        { this.state.skill.diagram !== this.props.diagram_id && <FlowBar
                                skill={this.state.skill}
                                deleteFlow={this.deleteFlow}
                                copyFlow={this.copyFlow}
                                renameFlow={this.renameFlow}
                                enterFlow={this.enterFlow}
                                preview={this.props.preview}
                                diagram={diagram}
                            />
                        }
                        {this.state.blockMenu}
                        <SRD.DiagramWidget
                            diagramEngine={this.state.engine}
                            allowLooseLinks={false}
                            locked={this.props.preview}
                            onConfirm={this.props.onConfirm}
                            nodeProps={{
                                hasFlow: this.hasFlow,
                                enterFlow: this.enterFlow,
                                removeNode: this.removeNode,
                                diagram: diagram,
                                removeCombineNode: this.removeCombineNode,
                                addRemoveListener: this.addRemoveListener
                            }}
                            removeHandler={(node) => {
                                if (this.props.undoEvents.length >= 10) {
                                    this.props.shiftUndo()
                                }
                                this.props.addUndo(node, 'remove')
                                this.props.clearRedo()
                            }}
                            forceRepaint={this.forceRepaint}
                            live_mode={this.props.live_mode}
                            clickDiagram={this.clickDiagram}
                            editorOpen={this.state.open}
                        />
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default compose(undo,redo)(Canvas);
