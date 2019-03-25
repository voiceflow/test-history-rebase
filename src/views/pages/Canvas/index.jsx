import React, { Component } from 'react'
import * as SRD from './../../components/SRD/main.js'
import Menu from './Menu'
import Editor from './Editor'
import axios from 'axios'
import { compose } from 'recompose'
import { connect } from "react-redux";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// import Loader from './Loader'
import 'draft-js/dist/Draft.css'
import './../../components/SRD/sass/main.css';
import './StoryBoard.css'

//HOCs
import {undo, redo} from './../../HOC/UndoRedo';
import { open, blockMenu } from './../../HOC/canvasHelper';
import { keyboardModal } from './../../HOC/ModalHandlers'

import { WidgetBar } from './components/WidgetBar'
import CanvasWarning from './components/CanvasWarning'
//Helpers
import { combineAppendValidation } from './../../helpers/combineHelper'

import { updateVersion, updateIntents, setCanFulfill } from "./../../../actions/versionActions";
import { setVariables } from './../../../actions/variableActions'
import { setCanvasError } from 'actions/userActions'
import { renameDiagram } from 'actions/diagramActions'
import { setError, setConfirm } from 'actions/modalActions'

import ActionGroup from './ActionGroup'
import HelpModal from './HelpModal'
import TestModal from './Test/TestModal'
import new_template from './../../../assets/templates/new'
import { Alert, ListGroup, ListGroupItem, Input } from 'reactstrap'

import cloneDeep from 'lodash/cloneDeep'
import * as util from './util'
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
import { Spinner } from './../../components/Spinner'

import { SLOT_TYPES, ALLOWED_GOOGLE_BLOCKS } from 'Constants'

import Linter from './linter'
import { getUtterancesWithSlotNames, getSlotsForKeys } from '../../../util'
import randomstring from 'randomstring'
import { checkBlockDisabledLive } from './Blocks'

import { Prompt } from 'react-router'
import moment from 'moment'
import Upgrade from '../../components/Modals/MultiPlatformModalContent.jsx';

const NLC = require('natural-language-commander')
const _ = require('lodash')
const toolkit = new Toolkit()

export class Canvas extends Component {
    constructor(props) {
        super(props)
        // preview mode
        // this.preview = !!this.props.preview

        this.onSave = this.onSave.bind(this);
        this.createDiagram = this.createDiagram.bind(this);
        this.enterFlow = this.enterFlow.bind(this);
        this.deleteFlow = this.deleteFlow.bind(this);
        var engine = new SRD.DiagramEngine()
        engine.registerLabelFactory(new SRD.DefaultLabelFactory())
        engine.registerNodeFactory(new BlockNodeFactory())
        engine.registerLinkFactory(new BlockLinkFactory(null, null, this.props.preview))
        engine.registerPortFactory(new BlockPortFactory())

        let diagram_name = ''

        if (window.Appcues){
            window.Appcues.identify(window.user_detail.id, {
                email: window.user_detail.email,
                name: window.user_detail.name,
                roles: window.user_detail.admin
            })
        }
        this.loaded = false
        this.time_mounted = null;

        this.state = {
            engine: engine,
            diagram_name: diagram_name,
            saving: false,
            saved: true,
            testing_modal: false,
            testing_info: false,
            help: null,
            helpOpen: false,
            copy: null,
            activityTime: 1000 * 60 * 2, // Multiply for mins
            load_diagram: true,
            diagram_level_intents: {
                alexa: new Set(),
                google: new Set()
            },
            confirm_info: null,
            spotlight: false,
            upgrade_modal: false,
            type_counter: {}
        }

        if (window.performance) {
          if (performance.naviation && performance.navigation.type === 1) {
            this.trackCanvasTime();
          }
        }
      
        // SKILL IS LOADED HERE
        this.onLoadId(props.diagram_id)
    }

    setMousetrap = () => {
        Mousetrap.reset()
        Mousetrap.bind(['shift+/'], () => this.props.toggleKeyboard(!this.props.keyboardHelp))
        Mousetrap.bind(['ctrl+c', 'command+c'], () => this.setState({
            copy: this.state.engine
                .getDiagramModel()
                .getSelectedItems()
                .filter(n => n instanceof BlockNodeModel)
        }))
        Mousetrap.bind(['ctrl+v', 'command+v'], this.paste)
        Mousetrap.bind(['ctrl+z', 'command+z'], this.undo)
        Mousetrap.bind(['ctrl+y', 'command+y', 'ctrl+shift+z', 'command+shift+z'], this.redo)
        Mousetrap.bind(['ctrl+/', 'command+/'], this.addComment)
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
        if (window.Appcues) {
            window.Appcues.page()
        }
        this.events = [
            'load',
            'mousemove',
            'mousedown',
            'click',
            'scroll',
            'keypress'
        ];

        for (var i in this.events) {
            window.addEventListener(this.events[i], this.resetTimeout);
        }
        this.time_mounted = new Date()
        this.total_time = 0;

        this.setTimeout();
        this.setMousetrap()
        // AUTOSAVE EVERY 10 SECONDS
        if(!this.props.preview && this.props.skill && this.props.skill.skill_id && this.props.diagram_id && !window.error){
            this.interval = setInterval(()=>{
                if(this.lastModel){
                    var currentModel = JSON.stringify(util.serializeDiagram(this.state.engine))
                    if(currentModel !== this.lastModel){
                        if(util.canSave(currentModel)){
                            this.tooBig = false
                            this.onSave()
                        }else{
                            if(!this.tooBig){
                                this.tooBig = true
                                this.props.setError('Your flow is too large to be saved - Delete blocks and use sub-flows to reduce size')
                            }
                        }
                    }
                }
            }, 10000)
        }
    }

    componentWillUnmount() {
        if(!this.props.preview && this.props.skill && this.props.skill.skill_id && this.props.diagram_id && !window.error){
            this.onSave(false)
        }
        Mousetrap.reset()
        if(this.interval){
            clearInterval(this.interval)
        }
        if (this.props.skill) {
          this.trackCanvasTime();
        }
        localStorage.setItem('is_first_session', 'false')
    }

    clearTimeoutFunc = () => {
        if (this.activityTimeout) clearTimeout(this.activityTimeout);
    };

    setTimeout = () => {
        this.activityTimeout = setTimeout(this.pauseActivity, this.state.activityTime);
    };

    pauseActivity = () => {
        this.time_active = this.time_active ? (new Date() - this.time_mounted) + this.time_active : new Date() - this.time_mounted;
        this.isInactive = true;
    };

    trackCanvasTime = () => {
        let time_unmounted = new Date()
        if (!!this.props.skill && this.time_mounted) {
            axios.post('/analytics/track_active_canvas', {
                duration: this.time_active ? time_unmounted - this.time_mounted + this.time_active : time_unmounted - this.time_mounted,
                skill_id: this.props.skill.skill_id
            })
        }
        this.time_mounted = null
    }

    resetTimeout = () => {
        if (this.isInactive) this.time_mounted = new Date()
        this.isInactive = false;
        this.clearTimeoutFunc();
        this.setTimeout();
    };
    componentDidUpdate(previous_props, prev_state) {
        if(previous_props.diagram_id !== this.props.diagram_id){
            if(this.buildDiagrams !== null){
                this.buildDiagrams(this.props.diagram_id)
            }
            this.props.setOpen(false)
            let nodes = _.values(this.state.engine.diagramModel.nodes)
            this.state.engine.enableRepaintEntities(nodes)
            this.state.engine.repaintCanvas(false)
            this.setState({
                load_diagram: true
            })
            this.onLoadId(this.props.diagram_id)
        }
    }

    mouseMove = ({clientX, clientY}) => {
        this.mouseX = clientX
        this.mouseY = clientY
    }

    paste = () => {
        if(this.state.copy){
            let event = {
                clientX: this.mouseX,
                clientY: this.mouseY
            }
            var point = this.state.engine.getRelativeMousePoint(event)
            let centerX = _.maxBy(this.state.copy, 'x').x - (_.maxBy(this.state.copy, 'x').x - _.minBy(this.state.copy, 'x').x)/2
            let centerY = _.maxBy(this.state.copy, 'y').y - (_.maxBy(this.state.copy, 'y').y - _.minBy(this.state.copy, 'y').y)/2
            _.forEach(this.state.copy, (node,idx) => {
                this.copyNode(node, { x: point.x + (node.x - centerX), y: point.y + (node.y - centerY)})
            })
        }
    }

    undo = (e) => {
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

    redo = (e) => {
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

    addComment = (e) => {
        e.preventDefault()
        this.onDrop('comment')
    }
            
    removeNode = (selectedNode = null) => {
        let selected = selectedNode ? selectedNode : this.state.engine.getSuperSelect()
        if(!checkBlockDisabledLive(this.props.live_mode, selected.extras.type)){
            this.state.engine.stopMove()
            if (selected.extras && selected.extras.type === 'god'){
                this.props.setConfirm({
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
            this.props.setError('Cannot delete blocks that would alter the interaction model in live version editing')
        }
    }
    // copy individual node
    copyNode = (newNode = null, pos = null) => {
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

    appendCombineNode = (node) => {
        let idx = _.findIndex(node.parentCombine.combines, c => c.id === node.id);
        let amountZoom = this.state.engine.getDiagramModel().getZoomLevel() / 100;
        let engine = this.state.engine;
        if (idx !== -1 && combineAppendValidation(node)){
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

    removeCombineNode = (node) => {
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
                                this.props.setConfirm({
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

            this.props.setConfirm({
                warning: true,
                text: <Alert color="danger" className="mb-0">Remove this command?</Alert>,
                confirm: removeNode
            })
        }else{
            removeNode()
        }
    }


    combineNode = (e = null) => {
      let current = this.state.engine.getSuperSelect();
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
                 if ((tempIdx <= parent.combines.length && current.parentCombine && combineAppendValidation(isValid)) || (!current.parentCombine && tempIdx + 1 === parent.combines.length)){
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
        }
      })
    }
    
    copyFlow = (flow_id) => {
        let flow = this.props.diagrams.find(d => d.id === flow_id)
        if (!flow) {
            return
        }

        const copy = (save = true) => {

            let new_flow_name = flow.name + ' (COPY)'
            let index = 1
            const exists = (name) => this.props.diagrams.find(d => d.name === name)
            while (exists(new_flow_name)) {
                new_flow_name = `${flow.name} (COPY ${index})`
                index++
            }

            axios.get(`/diagram/copy/${flow_id}?name=${encodeURI(new_flow_name)}`)
                .then((res) => {
                    let diagrams = this.props.diagrams
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
            this.saveCB = () => {
                copy(false)
            }
            this.onSave()
        } else {
            copy(true)
        }
    }
    
    deleteFlow(flow_id) {
        this.props.setConfirm({
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
                        let index = this.props.diagrams.findIndex(d => d.id === flow_id)
                        if (index !== -1) {
                            let diagrams = this.props.diagrams;
                            diagrams.splice(index, 1)
                            this.setState({
                                diagrams: diagrams
                            })
                        }
                        // If they are deleting the flow they are currently on, go back to ROOT
                        if (flow_id === this.props.diagram_id) {
                            this.enterFlow(this.props.root_id, false)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        alert('failed to delete diagram')
                    })
            }
        })
    }

    onDiagramUnfocus = () => {
        this.diagram_focus = false
        this.state.engine.getDiagramModel().clearSelection()
    }

    forceRepaint = () => {
        this.forceUpdate()
    }

    onSave(state=true) {
        if (this.saving) return
        this.saving = true
        try {
            if (!this.props.preview){
                state && this.setState({ saving: true })
                let serialize = util.serializeDiagram(this.state.engine)
                var data = JSON.stringify(serialize)

                let sub_diagrams = []

                serialize.nodes.forEach(node => {
                    if(node.extras.diagram_id){
                        sub_diagrams.push(node.extras.diagram_id)
                    }else if(node.extras.type === 'story' && Array.isArray(node.combines)){
                        node.combines.forEach(combine_node => {
                            let extras = combine_node.extras[this.props.skill.platform]
                            if(extras && extras.diagram_id){
                                sub_diagrams.push(extras.diagram_id)
                            }
                        })
                    }
                })

                if(state){
                    // UPDATE DIAGRAM STRUCTURE
                    let diagrams = this.props.diagrams
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
                    variables: this.props.variables,
                    data: data,
                    skill: this.props.skill.skill_id,
                    sub_diagrams: JSON.stringify(sub_diagrams),
                    global: this.props.skill.global
                }
                const s = this.props.skill;
                
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
                    if(typeof this.props.skillSaveCB === "function"){
                        this.props.skillSaveCB(serialize.id)
                    } else if(typeof this.saveCB === "function"){
                        this.saveCB(serialize.id)
                        this.saveCB = null
                    }
                }).catch(rej_err => {
                    this.saving = false
                    state && this.setState({
                        saving: false
                    }) && this.props.setError('Error Saving Project')

                    if(typeof this.props.skillSaveCB === "function"){
                        this.props.skillSaveCB(null)
                    } else if(typeof this.saveCB === "function"){
                        this.saveCB(null)
                        this.saveCB = null
                    }
                })
            }
        } catch (e) {
            this.saving = false
            console.log(e)
            state && this.props.setError('Error Saving - Project Structure (Check Logs)')
            if(typeof this.props.skillSaveCB === "function"){
                this.props.skillSaveCB(null)
            } else if(typeof this.saveCB === "function"){
                this.saveCB(null)
                this.saveCB = null
            }
        }
    }

    loadDiagram = (diagram, diagram_id) => {
        var engine = this.state.engine
        var model = new SRD.DiagramModel()

        let type_counter = {}
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
            diagram_json = util.convertDiagram(diagram_json, this.props.diagrams)
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
                if(type_counter[type] === undefined){
                    type_counter[type] = 1 
                } else {
                    type_counter[type] += 1
                }

                // Combine block
                if (Array.isArray(node.combines) && node.combines.length !== 0) {
                    node.combines.forEach(n => {
                        if (typeof n !== 'object') return

                        if(type_counter[n.extras.type] === undefined){
                            type_counter[n.extras.type] = 1 
                        } else {
                            type_counter[n.extras.type] += 1
                        }

                        if (this.props.skill.platform === 'google') {
                            n.fade = !ALLOWED_GOOGLE_BLOCKS.includes(n.extras.type)
                        } else {
                            n.fade = false
                        }
                        makeNodeMultiPlatform(n.extras.type, n)
                    })
                } else {
                    if (this.props.skill.platform === 'google') {
                        nodes[key].fade = !ALLOWED_GOOGLE_BLOCKS.includes(type)
                    } else {
                        nodes[key].fade = false
                    }
                    makeNodeMultiPlatform(type, node)
                }
            }

            engine.stopMove()
            engine.setDiagramModel(model)
            // make sure variables are unique and don't overlap with global variables
            let variables = []
            if (Array.isArray(diagram.variables)) {
                diagram.variables.forEach(v => {
                    if(!variables.includes(v) && !this.props.skill.global.includes(v)){
                        variables.push(v)
                    }
                })
            }
            this.props.setVariables(variables)
            this.props.setOpen(false)
            this.setState({
                load_diagram: false,
                type_counter: type_counter,
                engine: engine,
                diagram_name: diagram.title ? diagram.title : 'New Flow',
                diagram_level_intents: diagram_level_intents
            })
            // this.props.history.push(`/canvas/${this.props.skill.skill_id}/${this.props.skill.diagram}`)
            this.setState({ saved: true })
            this.updateLinter(true)
        } else {
            this.setState({
                load_diagram: false,
                type_counter: type_counter
            })
            this.props.setError('Could Not Open Project - Corrupted File')
        }
    }

    updateGoogleFade = () => {
        const engine = this.state.engine
        const model = engine.getDiagramModel()
        const nodes = model.getNodes()

        for (let key in nodes) {
            const node = nodes[key]
            const type = node.extras.type

            if (this.props.skill.platform === 'google') {
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

    updateLinter = (force=true) => {
        const engine = this.state.engine
        const model = engine.getDiagramModel()
        const nodes = model.getNodes()
        let update = false

        const lint = n => {
            if (typeof n !== 'object') return
            if (!n.linter) n.linter = []

            if (Linter[n.extras.type] && n.linter) {
                const res = Linter[n.extras.type](n, this.props.skill.platform)
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
                    const res = Linter[type](node, this.props.skill.platform)
                    if (res) update = true
                }
            }
        }
        
        if (force || update) {
            this.setState({
                engine: engine,
            })
            engine.repaintCanvas()
            this.forceRepaint()
        }
    }
    onLoadId = (diagram_id) => {
        axios.get('/diagram/'+ diagram_id)
        .then(res => {
            this.loadDiagram(res.data, diagram_id)
            // this.props.fetchDiagramSuccess(true)
            if(!this.props.preview){
                localStorage.setItem('flow', `${this.props.skill.skill_id}/${diagram_id}`)
            }
            if(this.buildDiagrams !== null){
                this.buildDiagrams(diagram_id)
            }
        })
        .catch(err => {
            console.error(err)
            this.props.setError('Could Not Retrieve Project')
        })
    }

    unsave = (e) => {
        if(e && e.node && !e.isCreated){
            let selected = this.state.engine.getSuperSelect()
            if(selected && e.node.id === selected.getID()){
                this.props.setOpen(false)
            }
        }

        if (this.state.saved) {
            this.setState({ saved: false })
        }
    }

    toggleTestModal = () => {
        this.setState({
            testing_info: false,
            testing_modal: !this.state.testing_modal
        })
    }

    runTest = () => {
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
            this.props.skill.slots.forEach(slot => {

                if (slot.type.value && slot.type.value.toLowerCase() === 'custom') {
                    nlc.addSlotType({
                        type: slot.name,
                        matcher: slot.inputs
                    })
                }
            })

            this.props.skill.intents.forEach(intent => {
                let samples
                if (!intent.built_in) {
                    samples = getUtterancesWithSlotNames(intent.inputs, this.props.skill.slots)
                }
                const _slots = getSlotsForKeys(intent.inputs.map(input => input.slots), this.props.skill.slots, this.props.skill.platform)

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

    onTest = () => {
        this.state.engine.getDiagramModel().clearSelection()
        this.toggleTestModal()

        if(this.props.preview){
            this.runTest()
        } else {
            this.saveCB = (diagram_id) => {
                if(diagram_id === null){
                    this.setState({
                        testing_modal: false
                    })
                }else{
                    axios.post(`/diagram/${diagram_id}/test/publish`,{
                        intents: this.props.skill.intents,
                        slots: this.props.skill.slots,
                        platform: this.props.skill.platform
                    })
                    .then(this.runTest)
                    .catch(err => {
                        console.log(err)
                        this.setState({
                            testing_modal: false
                        })
                        this.props.setError("Could Not Render Your Project")
                    })
                }
            }
            this.onSave()
        }
    }
    
    generateBlockMenu = (e, combineNode = null) => {
      if(this.props.preview){
        this.props.setBlockMenu(null)
        return
      }
      var nodeElement = toolkit.closest(e.target, ".node[data-nodeid]")
      e.preventDefault()
      let engine = this.state.engine
      if (nodeElement){
          let node = this.state.engine.getDiagramModel()
            .getNode(nodeElement.getAttribute("data-nodeid"))
          engine.getDiagramModel().clearSelection();
          engine.setSuperSelect(node)
          this.props.setBlockMenu(
            <React.Fragment>
                <div style={{top: engine.getDiagramModel().getGridPosition(e.clientY - 100), left: engine.getDiagramModel().getGridPosition(e.clientX), cursor: 'pointer', position: 'absolute', zIndex: 10}}>
                    <ListGroup>
                        {!combineNode && 
                            <ListGroupItem onClick={(e) => {
                                node.setLocked(true);
                                node.selected = true;
                                node.edit = true;
                                this.props.setBlockMenu(null)
                            }}>Rename</ListGroupItem>
                        }
                        <ListGroupItem onClick={() => {
                            if (combineNode){
                                this.appendCombineNode(combineNode)
                            } else {
                                this.copyNode(node)
                            }
                            this.props.setBlockMenu(null)
                        }}>Copy Block</ListGroupItem>
                        <ListGroupItem onClick={() => {
                            if (combineNode){
                                this.removeCombineNode(combineNode);
                            } else {
                                this.removeNode(node)
                            }
                            this.props.setBlockMenu(null)
                        }}>Delete Block</ListGroupItem>
                    </ListGroup>
                </div>
              </React.Fragment>)
        } else {
            this.props.setBlockMenu(
            <React.Fragment>
              <div style={{top: engine.getDiagramModel().getGridPosition(e.clientY - 110), left: engine.getDiagramModel().getGridPosition(e.clientX), cursor: 'pointer', position: 'absolute', zIndex: 10}}>
                  <ListGroup>
                      <ListGroupItem onClick={() => {
                        this.addComment(e)
                        this.props.setBlockMenu(null)
                      }}>Add Comment</ListGroupItem>
                  </ListGroup>
              </div>
            </React.Fragment>)
        }
    }
    // Create a new diagram from the flow block
    createDiagram(node, base_flow_name='New Flow', template=null, forCommand=false) {
      this.setState({load_diagram: true})
      let id = util.generateID()

      // Generate a new diagram, save it, and go to it
      let curr_template
      if(!template){
          curr_template = new_template
      } else {
          curr_template = template
      }
      curr_template.id = id
      let skill_id = this.props.skill.skill_id
      let data = JSON.stringify(curr_template)

      // No Duplicate Flow Names
      let new_flow_name = base_flow_name
      let index = 1
      const exists = (name) => this.props.diagrams.find(d => d.name === name)

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
        if (forCommand) {
          node.extras[this.props.skill.platform].diagram_id = id
        } else {
          node.extras.diagram_id = id
        }
        this.props.diagrams.push({
            name: new_flow_name,
            id: id
        })
        this.enterFlow(id)
      })
      .catch(err => {
        console.log(err.response)
        this.setState({loading_diagram: false})
        this.props.setError('Unable to create new Flow')
      })
    }

    enterFlow(new_diagram_id, save=true) {
      this.setState({load_diagram: true})
      if(new_diagram_id !== this.props.diagram_id){
          this.props.updateSkill("diagram", new_diagram_id)
          if(save && !this.props.preview){
              this.saveCB = () => {
                  this.props.history.push(`/canvas/${this.props.skill.skill_id}/${new_diagram_id}`)
              }
              this.onSave()
          }else if (this.props.preview){
              this.props.history.push(`/preview/${this.props.skill.skill_id}/${new_diagram_id}`)
          }else{
              this.props.history.push(`/canvas/${this.props.skill.skill_id}/${new_diagram_id}`)
          }
      }
      this.props.updateSkill("diagram", new_diagram_id);
    }

    updateFulfillmentOnDeletion = (deleted_node) => {
        const extras = deleted_node.extras[this.props.skill.platform]

        if (extras.intent && extras.intent.key) {
            const key = extras.intent.key
            const new_value = false
            this.props.setCanFulfill(key, new_value)
            this.state.diagram_level_intents[this.props.skill.platform].delete(key)
        }
        this.removeNode(deleted_node)
    }

    onDeleteIntentNode = (deleted_node) => {
        const skill = this.props.skill
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
            this.props.setConfirm(confirm_info)
        } else {
            this.updateFulfillmentOnDeletion(deleted_node)
        }
    }

    onDrop = (event) => {
        if (this.props.preview) return;
        var type, name
        if (typeof event === 'string') {
            type = event
            event = {
                clientX: this.mouseX,
                clientY: this.mouseY
            }
            if (this.state.spotlight) {
                this.setState({ spotlight: false })
            }
        } else {
            try {
                type = event.dataTransfer.getData('node')
                name = event.dataTransfer.getData('name')
            } catch (e) {
                return
            }
        }

        if (!name) {
            name = type.charAt(0).toUpperCase() + type.substr(1)
        }
        util.createDropNode(event, this.state.engine, type, name)
        this.combineNode()
        this.props.setOpen(type !== 'comment')
        this.setState({
            open: type !== 'comment'
        })
        this.updateGoogleFade()
        this.updateLinter()
    }

    onUpdate = () => {
        this.updateLinter()
        this.unsave()
    }

    render() {
        return (
          <React.Fragment>
            <Prompt
              message={() => {
                if (!util.canSave()) {
                  return "This flow is too large to be saved, please remove blocks to reduce size - are you sure you would like to leave without saving?";
                }
                return true;
              }}
            />
            <DefaultModal
              open={this.state.upgrade_modal}
              header="Multi Platform Development"
              toggle={() =>
                this.setState({
                  upgrade_modal: !this.state.upgrade_modal
                })
              }
              content={
                <Upgrade
                  history={this.props.history}
                  toggle={() =>
                    this.setState({
                      upgrade_modal: !this.state.upgrade_modal
                    })
                  }
                />
              }
              hideFooter={true}
              noPadding={true}
            />
            <DefaultModal
              open={this.props.keyboardHelp}
              header="Keyboard Shortcuts"
              toggle={() =>
                this.props.toggleKeyboard(!this.props.keyboardHelp)
              }
              content={<ShortCuts />}
            />
            <HelpModal
              open={this.state.helpOpen}
              help={this.state.help}
              toggle={() =>
                this.setState({ helpOpen: !this.state.helpOpen })
              }
              setHelp={help => this.setState({ help: help })}
            />
            {!this.props.preview ?
              <ActionGroup
                lastSave={
                  this.state.last_save
                    ? "Last saved " +
                      moment(this.state.last_save).fromNow()
                    : "Save"
                }
                setCB={cb => {
                  this.saveCB = cb;
                }}
                onSave={this.onSave}
                saving={this.state.saving}
                saved={this.state.saved}
                onTest={this.onTest}
                updateGoogleFade={this.updateGoogleFade}
                updateLinter={this.updateLinter}
                history={this.props.history}
              />
            :
              <div className="title-group no-select">
                <span className="text-blue" id="preview-title">
                  <span className="dot" /> PREVIEW MODE
                </span>
              </div>
            }
            {this.state.testing_modal ? (
              <TestModal
                open={this.state.testing_modal}
                toggle={this.toggleTestModal}
                testing_info={this.state.testing_info}
                unfocus={this.onDiagramUnfocus}
                flow={this.props.diagram.name}
              />
            ) : null}
            {this.state.spotlight && (
              <Spotlight
                addBlock={this.onDrop}
                cancel={() => this.setState({ spotlight: false })}
              />
            )}
            <div
              id="canvas"
              onMouseMove={this.mouseMove}
              onMouseUp={this.combineNode}
              onMouseDown={() => (this.diagram_focus = true)}
            >
              <Menu
                unfocus={this.onDiagramUnfocus}
                enterFlow={this.enterFlow}
                build={fn => (this.buildDiagrams = fn)}
                history={this.props.history}
                user={this.props.user}
                loading_diagram={this.props.load_diagram}
                copyFlow={this.copyFlow}
                deleteFlow={this.deleteFlow}
                preview={this.props.preview}
                toggleUpgrade={this.props.toggleUpgrade}
                type_counter={this.state.type_counter}
              />
              {this.state.load_diagram &&
                React.createElement(Spinner, { name: "Flow" })}

              <Editor
                unfocus={this.onDiagramUnfocus}
                open={this.props.open}
                diagramEngine={this.state.engine}
                node={this.state.engine.getSuperSelect()}
                onUpdate={this.onUpdate}
                close={() => this.props.setOpen(false)}
                setHelp={help =>
                  this.setState({ help: help, helpOpen: true })
                }
                createDiagram={this.createDiagram}
                enterFlow={this.enterFlow}
                repaint={this.forceRepaint}
                removeNode={
                  !this.props.preview ? this.removeNode : _.noop()
                }
                copyNode={
                  !this.props.preview ? this.copyNode : _.noop()
                }
                appendCombineNode={
                  !this.props.preview
                    ? this.appendCombineNode
                    : _.noop()
                }
                removeCombineNode={
                  !this.props.preview
                    ? this.removeCombineNode
                    : _.noop()
                }
                preview={this.props.preview}
                onboarding={this.onboarding}
                finished={() => {
                  this.onboarding = false;
                }}
                history={this.props.history}
                diagram_level_intents={this.state.diagram_level_intents}
                setCanvasEvents={this.setMousetrap}
                updateLinter={this.updateLinter}
              />
              <div
                key={this.props.diagram_id}
                id="diagram"
                className={this.props.preview ? " no-padding" : ""}
                onDrop={this.onDrop}
                onDragOver={e => e.preventDefault()}
                onMouseLeave={() => (this.diagram_focus = false)}
                onContextMenu={this.generateBlockMenu}
              >
              <div className='canvas-warnings'>
                    <ReactCSSTransitionGroup
                        transitionName="fade"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={300}
                    >
                        {_.map(this.props.canvasError, (err, idx) =>
                            <CanvasWarning key={idx} idx={idx} err={err} />
                        )}
                    </ReactCSSTransitionGroup>
              </div>
                <WidgetBar
                  toggleKeyboard={this.props.toggleKeyboard}
                  keyboardHelp={this.props.keyboardHelp}
                  engine={this.state.engine}
                  setOpen={this.props.setOpen}
                  update={engine => this.setState({ engine: engine })}
                />
                {this.props.root_id !== this.props.diagram_id && (
                  <FlowBar
                    deleteFlow={this.deleteFlow}
                    copyFlow={this.copyFlow}
                    enterFlow={this.enterFlow}
                    preview={this.props.preview}
                    diagram={this.props.diagram}
                    root_id={this.props.root_id}
                    setBlockMenu={this.props.setBlockMenu}
                    engine={this.state.engine}
                  />
                )}
                {this.props.blockMenu}
                <SRD.DiagramWidget
                  diagramEngine={this.state.engine}
                  allowLooseLinks={false}
                  locked={this.props.preview}
                  onConfirm={this.props.setConfirm}
                  onDeleteIntentNode={this.onDeleteIntentNode.bind(
                    this
                  )}
                  nodeProps={{
                    hasFlow: diagram_id =>
                      this.props.diagram_set.has(diagram_id),
                    enterFlow: this.enterFlow,
                    setCanvasError: this.props.setCanvasError,
                    removeNode: this.removeNode,
                    diagram: this.props.diagram,
                    removeCombineNode: this.removeCombineNode,
                    generateBlockMenu: this.generateBlockMenu,
                    disabled: !!this.props.preview
                  }}
                  removeHandler={node => {
                    if (this.props.undoEvents.length >= 10) {
                      this.props.shiftUndo();
                    }
                    this.props.addUndo(node, "remove");
                    this.props.clearRedo();
                  }}
                  forceRepaint={this.forceRepaint}
                  live_mode={this.props.live_mode}
                  editorOpen={this.props.open}
                  setBlockMenu={this.props.setBlockMenu}
                  setOpen={this.props.setOpen}
                />
              </div>
            </div>
          </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
  return {
    skill: state.skills.skill,
    diagram_id: state.skills.skill.diagram,
    diagrams: state.diagrams.diagrams,
    diagram_error: state.diagrams.error,
    root_id: state.diagrams.root_id,
    error: state.skills.error,
    variables: state.variables.localVariables,
    diagram_set: new Set(state.diagrams.diagrams.map(d => d.id)),
    diagram: _.find(state.diagrams.diagrams, d => d.id === state.skills.skill.diagram),
    canvasError: state.userSetting.canvasError
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateSkill: (type, val) => dispatch(updateVersion(type, val)),
    setVariables: (variable) => dispatch(setVariables(variable)),
    updateIntents: () => dispatch(updateIntents()),
    setCanFulfill: (key, val) => dispatch(setCanFulfill(key, val)),
    renameFlow: (id, name) => dispatch(renameDiagram(id, name)),
    setCanvasError: (err) => dispatch(setCanvasError(err)),
    setError: (err) => dispatch(setError(err)),
    setConfirm: (confirm) => dispatch(setConfirm(confirm))
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  open,
  blockMenu,
  keyboardModal,
  undo,
  redo,
)(Canvas);
