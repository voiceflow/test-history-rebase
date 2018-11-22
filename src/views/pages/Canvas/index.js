import React, { Component } from 'react';
import $ from 'jquery';
import * as SRD from 'storm-react-diagrams';
import Menu from './Menu';
import Editor from './Editor';
import moment from 'moment';
import axios from 'axios';
// import Loader from './Loader';
import 'draft-js/dist/Draft.css'
import 'storm-react-diagrams/dist/style.min.css';
import './StoryBoard.css';
import TitleBar from './TitleBar';
import LoadingModal from './../../components/Modals/LoadingModal';
import ConfirmModal from './../../components/Modals/ConfirmModal';
import HelpModal from './HelpModal';
import SkillModal from './../Dashboard/Skill/SkillModal';
import TestModal from './Test/TestModal';
import { Prompt } from 'react-router';
import blank_template from './../../../assets/templates/blank';
import new_template from './../../../assets/templates/new';
import { Button, ButtonGroup } from 'reactstrap';

import Cookies from 'universal-cookie';

import { BlockNodeModel } from './SRD/models/BlockNodeModel';
import { BlockLinkFactory } from './SRD/factories/BlockLinkFactory';
import { BlockPortFactory } from './SRD/factories/BlockPortFactory';
import { BlockNodeFactory } from './SRD/factories/BlockNodeFactory';

// import { DiagramWidget } from './SRD/base/widgets/DiagramWidget';

const cookies = new Cookies();
const defaultVariables = ['sessions', 'user_id', 'timestamp'];
const line_color = '#D1D8E2';
const line_width = 2.5;

const generateID = () => {
    return "xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

class Canvas extends Component {
    constructor(props) {
        super(props);

        this.loadLines = this.loadLines.bind(this);
        this.repaint = this.repaint.bind(this);
        this.dismissLoadingModal = this.dismissLoadingModal.bind(this);
        this.loadDiagram = this.loadDiagram.bind(this);
        this.setVariables = this.setVariables.bind(this);
        this.toggleTestModal = this.toggleTestModal.bind(this);
        this.createSkill = this.createSkill.bind(this);
        this.publishAMZN = this.publishAMZN.bind(this);
        this.publishMarket = this.publishMarket.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onTest = this.onTest.bind(this);
        this.onDiagramUnfocus = this.onDiagramUnfocus.bind(this);
        this.unsave = this.unsave.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.runTest = this.runTest.bind(this);
        this.createDiagram = this.createDiagram.bind(this);
        this.enterFlow = this.enterFlow.bind(this);
        this.removeNode = this.removeNode.bind(this);
        this.zoom = this.zoom.bind(this);
        this.buildDiagrams = null;
        this.loadUserModules = this.loadUserModules.bind(this);
        this.handleTemplateChoice = this.handleTemplateChoice.bind(this);
        this.toggleTemplateConfirm = this.toggleTemplateConfirm.bind(this);
        this.replaceWithTemplate = this.replaceWithTemplate.bind(this);

        // preview mode
        this.preview = !!this.props.preview;

        var engine = new SRD.DiagramEngine();
        engine.registerLabelFactory(new SRD.DefaultLabelFactory());
        engine.registerNodeFactory(new BlockNodeFactory());
        engine.registerLinkFactory(new BlockLinkFactory(line_color, line_width));
        engine.registerPortFactory(new BlockPortFactory());
        
        let open, diagram_id, skill_id;
        let diagram_name = '';

        let last_session = cookies.get('last_session', {path: '/'});
        let url = this.props.computedMatch;

        let newSkill = !!this.props.new;
        let variables = defaultVariables.slice(0);

        if(!newSkill){
            if (url && url.params.skill_id && url.params.diagram_id) {
                skill_id = url.params.skill_id;
                diagram_id = url.params.diagram_id;
            }else if(last_session){
                this.props.history.push('/canvas/' + last_session.skill_id + '/' + last_session.diagram_id);
                skill_id = last_session.skill_id;
                diagram_id = last_session.diagram_id;
            }else{
                this.props.history.push('/canvas/new');
            }
        }

        if(!this.preview && (!diagram_id || !skill_id)){
            newSkill = true;
            open = true;

            let model = new SRD.DiagramModel();
            let blank = blank_template;
            blank.id = generateID();

            model.deSerializeDiagram(blank, engine);

            let nodes = model.getNodes();
            for (let key in nodes) {
                if (nodes[key].extras.type === 'story' || nodes[key].extras.type === 'comment') {
                    nodes[key].clearListeners();
                    nodes[key].addListener({ entityRemoved: e => e.stopPropagation() });
                }
            }

            var links = model.getLinks();
            for (let key in links) {
                links[key].setColor(line_color);
                links[key].setWidth(line_width);
            }

            variables.push('user_name');

            engine.setDiagramModel(model);

            model.addListener({nodesUpdated: this.unsave});
            model.addListener({linksUpdated: this.unsave});

            diagram_name = 'ROOT'
        }

        this.state = {
            engine: engine,
            open: open,
            diagram_name: diagram_name,
            skill: {
                skill_id: skill_id,
                name: '...'
            },
            diagrams: [],
            diagram_id: diagram_id,
            loading_modal: !newSkill,
            error_modal: false,
            saving: false,
            saved: true,
            last_save: false,
            testing_modal: false,
            testing_info: false,
            variables: variables,
            newSkill: newSkill,
            help: null,
            helpOpen: false,
            user_modules: null,
            user_templates: []
        };

        if(!this.state.newSkill){
            this.onLoadSkill(this.state.skill.skill_id);
            // this.onLoadId('6cd76bb5-6d47-454f-b393-fb6bcb6505fe');
        }
    }

    zoom(delta){
        let engine = this.state.engine;
        let diagramModel = engine.getDiagramModel();
        const oldZoomFactor = diagramModel.getZoomLevel() / 100;
        let scrollDelta = delta / 60;

        if(scrollDelta < 0){
            if (diagramModel.getZoomLevel() + scrollDelta > 10) {
                diagramModel.setZoomLevel(diagramModel.getZoomLevel() + scrollDelta);
            }else{
                diagramModel.setZoomLevel(10)
            }
        }else{
            if (diagramModel.getZoomLevel() + scrollDelta < 150) {
                diagramModel.setZoomLevel(diagramModel.getZoomLevel() + scrollDelta);
            }else{
                diagramModel.setZoomLevel(150)
            }
        }

        const zoomFactor = diagramModel.getZoomLevel() / 100;

        const boundingRect = engine.canvas.getBoundingClientRect();
        const clientWidth = boundingRect.width;
        const clientHeight = boundingRect.height;
        // compute difference between rect before and after scroll
        const widthDiff = clientWidth * zoomFactor - clientWidth * oldZoomFactor;
        const heightDiff = clientHeight * zoomFactor - clientHeight * oldZoomFactor;
        // compute mouse coords relative to canvas
        const clientX = clientWidth/2 - boundingRect.left;
        const clientY = clientHeight/2 - boundingRect.top;

        // compute width and height increment factor
        const xFactor = (clientX - diagramModel.getOffsetX()) / oldZoomFactor / clientWidth;
        const yFactor = (clientY - diagramModel.getOffsetY()) / oldZoomFactor / clientHeight;

        diagramModel.setOffset(
            diagramModel.getOffsetX() - widthDiff * xFactor,
            diagramModel.getOffsetY() - heightDiff * yFactor
        );

        this.setState({
            engine: engine
        });
    }

    handleTemplateChoice(module){
        this.toggleTemplateConfirm(module);
    }

    replaceWithTemplate(module_id){
        this.setState({
            template_confirm: null
        })

        axios.get(`/marketplace/template/${module_id}/`, {
            diagram_id: this.state.diagram_id
        })
        .then(res => {
            this.loadDiagram(res.data);
        })
        .catch(err => {
            console.log(err.response);
            this.setState({
                saving: false,
                error_modal: 'Error retrieving template'
            });
        })
    }

    toggleTemplateConfirm(module){
        if(!!this.state.template_confirm){
            this.setState({
                template_confirm: null
            });
        } else {
            let confirm = {
                text: `Replace current flow completely with ${module.title} template?`,
                confirm: ()=> this.replaceWithTemplate(module.module_id)
            }
            this.setState({
                template_confirm:confirm
            });
        }
    }

    removeNode(){
        let selected = this.state.engine.getSuperSelect();
        this.state.engine.stopMove();
        if(selected){
            selected.remove();
        }
    }

    componentWillReceiveProps(nextProps){
        let url = nextProps.computedMatch;
        if (url && url.params.diagram_id && url.params.diagram_id !== this.state.diagram_id) {
            let diagram_id = url.params.diagram_id;
            this.setState({
                diagram_id: diagram_id
            }, () => this.onLoadId(diagram_id))
        }
    }

    componentDidMount() {

        $('#diagram').click((e) => {
            let engine = this.state.engine;
            let selected = engine.getDiagramModel().getSelectedItems("node");

            if (selected.length === 1 && selected[0].extras.type !== 'comment') {
                engine.setSuperSelect(selected[0]);
                this.setState({
                    engine: engine,
                    open: true
                });
            } else if (selected.length === 0) {
                let model = engine.getDiagramModel();
                let nodes = model.getNodes();
                for (let key in nodes) {
                    if (nodes[key].extras.type === 'comment' && nodes[key].name.trim().length === 0) {
                        model.removeNode(nodes[key].getID());
                        this.forceUpdate();
                    }
                }
            }
        });

        $('#Editor').mousedown(this.onDiagramUnfocus);

        // If in preview mode
        if(this.preview){
            $('#Editor').on('click dblclick focus focusin focusout keydown keypress keyup load mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup select submit', 
                '#editor-section', 
                function(e){
                e.preventDefault();
                return false;
            });
        }else{
            this.loadUserModules();
            $(document).keydown(function(event) {
                // If Control or Command key is pressed and the S key is pressed
                // run save function. 83 is the key code for S.
                if ((event.ctrlKey || event.metaKey) && event.which === 83) {
                    event.preventDefault();
                    // Save Function
                    if (!this.state.saved) {
                        this.onSave();
                    }

                    return false;
                }
            }.bind(this));
        }
    }

    loadUserModules(){
        axios.get('/marketplace/user_module')
        .then(res => {
            let user_modules = [];
            let user_templates = [];
            for(var i=0; i<res.data.length;i++){
                if(res.data[i].type === 'FLOW'){
                    user_modules.push(res.data[i]);
                } else {
                    user_templates.push(res.data[i]);
                }
            }

            this.setState({
                user_modules: user_modules,
                user_templates: user_templates
            })
        })
        .catch(err => {
            console.log(err.response);
            this.setState({
                saving: false,
                loading_modal: true,
                error_modal: 'Error retrieving modules'
            });
        });
    }

    onDiagramUnfocus() {
        this.state.engine.getDiagramModel().clearSelection();
    }

    repaint() {
        this.state.engine.repaintCanvas();
    }

    onSave(cb, is_new=false) {
        try {
            this.setState({ saving: 'Saving...' });
            var engine = this.state.engine;
            var model = engine.getDiagramModel();
            let serialize = model.serializeDiagram();
            serialize.id = this.state.diagram_id;
            var data = JSON.stringify(serialize);

            let sub_diagrams = [];
            let permissions = new Set();
            
            serialize.nodes.forEach(node => {
                if(node.extras.type === 'flow' && node.extras.diagram_id){
                    sub_diagrams.push(node.extras.diagram_id);
                }
                if (node.extras.type === 'permissions') {
                    node.extras.permissions.forEach(permission => {
                        permissions.add(permission.selected.value)
                    })
                }
            })

            permissions = [...permissions]

            for (var i = 0; i < this.state.diagrams.length; i++) {
                let diagrams = this.state.diagrams;
                if(diagrams[i].id === this.state.diagram_id){
                    diagrams[i].sub_diagrams = sub_diagrams;
                }
                this.setState({
                    diagrams: diagrams
                }, () => {
                    if(this.buildDiagrams !== null){
                        this.buildDiagrams();
                    }
                });
            }

            var diagram = {
                id: this.state.diagram_id,
                title: this.state.diagram_name,
                variables: this.state.variables,
                data: data,
                skill: this.state.skill.skill_id,
                sub_diagrams: JSON.stringify(sub_diagrams),
                permissions: permissions
            }

            axios.post(`/diagram${is_new ? '?new=1' : ''}`, diagram)
            .then(() => {
                this.setState({
                    saving: false,
                    saved: true,
                    last_save: Date.now()
                });
                if(typeof cb === "function") cb(this.state.diagram_id);
            })
            .catch(err => {
                console.log(err.response);
                this.setState({
                    saving: false,
                    loading_modal: true,
                    error_modal: 'Error Saving to Cloud (Check Logs)'
                });
                if(typeof cb === "function") cb(null);
            });
        } catch (e) {
            console.log(e);
            this.setState({
                loading_modal: true,
                error_modal: 'Error Saving - Project Structure (Check Logs)'
            });
            if(typeof cb === "function") cb(null);
        }
    }

    loadLines() {
        let engine = this.state.engine;
        let model = engine.getDiagramModel();
        let id = model.getID();
        $.ajax({
            url: '/analytics/story/' + id + '/lines',
            type: 'GET',
            success: (data) => {
                var nodes = model.getNodes();
                for (let key in nodes) {
                    if(data[key]){
                        nodes[key].extras.reads = data[key];
                    }else{ 
                        nodes[key].extras.reads = 0;
                    }
                }
                engine.setDiagramModel(model);
                this.setState({
                    engine: engine
                });
            },
            error: (e) => {
                console.log(e);
                this.setState({
                    loading_modal: true,
                    error_modal: "Unable to load Line data"
                });
            }
        });
    }

    loadDiagram(diagram) {
        var engine = this.state.engine;
        var model = new SRD.DiagramModel();

        let diagram_json = false;
        try {
            diagram_json = JSON.parse(diagram.data);
        } catch (e) {
            console.log(e);
        }
        if (diagram_json) {
            model.deSerializeDiagram(diagram_json, engine);
            model.addListener({ nodesUpdated: this.unsave });
            model.addListener({ linksUpdated: this.unsave });
            var nodes = model.getNodes();
            for (let key in nodes) {
                if (nodes[key].extras.type === 'story' || nodes[key].extras.type === 'comment') {
                    nodes[key].clearListeners();
                    nodes[key].addListener({ entityRemoved: e => e.stopPropagation() });
                }
            }
            var links = model.getLinks();
            for (let key in links) {
                links[key].setColor(line_color);
                links[key].setWidth(line_width);
            }
            
            engine.stopMove();
            engine.setDiagramModel(model);

            let variables = defaultVariables.slice(0);
            if (Array.isArray(diagram.variables)) {
                diagram.variables.forEach(v => {
                    if(!variables.includes(v)){
                        variables.push(v);
                    }
                });
            }

            this.setState({
                open: false,
                engine: engine,
                diagram_name: diagram.title ? diagram.title : 'New Flow',
                last_save: diagram.last_save,
                loading_modal: false,
                variables: variables
            });

            this.setState({ saved: true });
        } else {
            this.setState({ error_modal: 'Could Not Open Project - Corrupted File' });
        }
    }

    onLoadDiagrams(){
        if(this.preview){
            this.onLoadId(this.state.diagram_id);
        }else{
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
                    this.onLoadId(this.state.diagram_id);
                });
            })
            .catch(err => {
                console.error(err.response);
                this.setState({ error_modal: 'Could Not Retrieve Project Diagrams' });
            });
        }
    }

    onLoadSkill(skill_id){
        axios.get('/skill/'+skill_id+'?simple=1')
        .then(res => {
            this.setState({
                skill: res.data
            }, this.onLoadDiagrams);
        })
        .catch(err => {
            console.error(err.response);
            this.setState({ error_modal: 'Could Not Retrieve Project' });
        })
    }

    onLoadId(diagram_id) {
        $.ajax({
            url: '/diagram/'+ diagram_id,
            type: 'GET',
            success: diagram => {
                this.loadDiagram(diagram);

                if(!this.preview){
                    cookies.set('last_session', {
                        skill_id: this.state.skill.skill_id,
                        diagram_id: diagram_id
                    }, {path: '/'});
                }

                if(this.buildDiagrams !== null){
                    this.buildDiagrams();
                }
            },
            error: () => {this.setState({ error_modal: 'Could Not Retrieve Project' });}
        });
    }

    dismissLoadingModal() {
        this.setState({
            loading_modal: false
        });
        // this.props.history.push('/dashboard');
    }

    unsave(e) {
        if(e && e.node && !e.isCreated){
            let selected = this.state.engine.getSuperSelect();
            if(selected && e.node.id === selected.getID()){
                this.setState({
                    open: false
                });
            }
        }

        if (this.state.saved) {
            this.setState({ saved: false });
        }
    }

    setVariables(variables) {
        this.setState({
            variables: variables,
            saved: false
        });
    }

    toggleTestModal() {
        this.setState({
            testing_info: false,
            testing_modal: !this.state.testing_modal
        });
    }

    runTest() {
        let engine = this.state.engine;
        let model = engine.getDiagramModel();
        let data = model.serializeDiagram();
        // model.deSerializeDiagram(JSON.parse(JSON.stringify(data)), engine);
        
        let nodes = [];
        data.nodes.forEach((node) => {
            if(node.extras && node.extras.type !== "story"){
                nodes.push({
                    value: node.id,
                    label: node.name
                });               
            }
        });
        this.setState({
            testing_info: {
                id: this.state.diagram_id,
                nodes: nodes
            }
        });
    }

    onTest() {
        this.state.engine.getDiagramModel().clearSelection();
        this.toggleTestModal();

        if(this.preview){
            this.runTest();
        }else{
            this.onSave(diagram_id => {
                if(diagram_id === null){
                    this.setState({
                        testing_modal: false
                    });
                }else{
                    axios.post(`/diagram/${diagram_id}/test/publish`)
                    .then(this.runTest)
                    .catch(err => {
                        console.log(err.response);
                        this.setState({
                            error_modal: "Could Not Render Your Project",
                            loading_modal: true,
                            testing_modal: false
                        });
                    });
                }
            });
        }
    }

    createSkill(name){
        if(!name){
            name = 'New Skill';
        }

        let diagram_id = generateID();

        axios.post('/skill', {
          name: name,
          diagram: diagram_id
        })
        .then(res => {
            let skill_id = res.data.id;
            cookies.set('last_session', {
                skill_id: skill_id,
                diagram_id: diagram_id
            }, {path: '/'});

            this.setState({
                skill: {
                    skill_id: skill_id,
                    name: name,
                    review: false,
                    live: false
                },
                newSkill: 0,
                diagram_id: diagram_id
            }, () => {
                this.onSave(() => {
                    this.state.diagrams.push({
                        id: diagram_id,
                        name: 'ROOT'
                    });
                    if(this.buildDiagrams !== null){
                        this.buildDiagrams();
                    }
                    this.props.history.push(`/canvas/${skill_id}/${diagram_id}`);
                }, true)
            });
        })
        .catch(err => {
            this.setState({ error_modal: 'Could Not Create Project - Error' });
        });
    }

    // Create a new diagram from the flow block
    createDiagram(node){
        this.setState({
            loading_modal: true
        });

        let id = generateID();

        node.extras.diagram_id = id;

        // save the current diagram
        this.onSave(() => {

            // Generate a new diagram, save it, and go to it
            let template = new_template;
            template.id = id;
            let skill_id = this.state.skill.skill_id;
            let data = JSON.stringify(template);

            var diagram = {
                id: id,
                title: 'New Flow',
                variables: defaultVariables.slice(0),
                data: data,
                skill: skill_id
            }

            axios.post('/diagram?new=1', diagram)
            .then(() => {
                this.state.diagrams.push({
                    name: 'New Flow',
                    id: id
                });
                this.props.history.push(`/canvas/${skill_id}/${id}`);
            })
            .catch(err => {
                console.log(err.response);
                this.setState({
                    saving: false,
                    loading_modal: true,
                    error_modal: 'Unable to create new Flow'
                });
            });
        });
    }

    publishAMZN() {
        this.onSave(diagram_id => {
            this.props.history.push('/publish/amzn/' + this.state.skill.skill_id);
        });
    }

    publishMarket() {
        this.onSave(diagram_id => {
            this.props.history.push('/publish/market/' + this.state.skill.skill_id);
        });
    }

    enterFlow(new_diagram_id) {
        if(new_diagram_id !== this.state.diagram_id){
            this.onSave(() => {
                this.props.history.push(`/canvas/${this.state.skill.skill_id}/${new_diagram_id}`);
            });
        }
    }

    onDrop(event) {
        if(this.preview) return;

        var engine = this.state.engine;
        try {
            var type = event.dataTransfer.getData('node');
        } catch (e) {
            return;
        }

        var node = new BlockNodeModel(type.charAt(0).toUpperCase() + type.substr(1));

        if(type){
            if (type === 'choice') {
                node.addInPort(' ');
                node.addOutPort('else').setMaximumLinks(1);
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
            } else if (type === 'audio') {
                node.addInPort(' ');
                node.addOutPort(' ').setMaximumLinks(1);
                node.extras = {
                    audio: false,
                    lines: [
                        {
                            collapse: true,
                            audio: false,
                            title: 'Line Audio'
                        }
                    ]
                };
            } else if (type === 'speak') {
                node.addInPort(' ');
                node.addOutPort(' ').setMaximumLinks(1);
                node.extras = {
                    dialogs: []
                }
            } else if (type === 'flow') {
                node.addInPort(' ');
                node.addOutPort(' ').setMaximumLinks(1);
                node.extras = {
                    diagram_id: null,
                    inputs: [],
                    outputs: []
                };
            } else if (type === 'command') {
                node.addOutPort(' ').setMaximumLinks(1);
                node.extras = {
                    commands: ''
                };
            } else if (type === 'comment') {
                node.name = 'New Comment';
                node.clearListeners();
                node.addListener({ entityRemoved: e => e.stopPropagation() });
            } else if (type === 'ending') {
                node.addInPort(' ');
                node.extras = {
                    audio: '',
                    audioText: '',
                    audioVoice: ''
                };
            } else if (type === 'random') {
                node.addInPort(' ');
                node.addOutPort(1).setMaximumLinks(1);
                node.extras = {
                    paths: 1
                };
            } else if (type === 'variable') {
                node.addInPort(' ');
                node.addOutPort(' ').setMaximumLinks(1);
                node.extras = {};
            } else if (type === 'set') {
                node.addInPort(' ');
                node.addOutPort(' ').setMaximumLinks(1);
                node.extras = {
                    sets: []
                };
            } else if (type === 'if') {
                node.addInPort(' ');
                node.addOutPort('else').setMaximumLinks(1);
                node.addOutPort('1').setMaximumLinks(1);
                node.extras = {
                    expressions: [{
                        type: 'value',
                        value: '',
                        depth: 0
                    }]
                };
            } else if (type === 'api') {
                node.name = 'API';
                node.addInPort(' ');
                node.addOutPort(' ').setMaximumLinks(1);
                node.addOutPort('fail').setMaximumLinks(1);
                node.extras = {
                    url: '',
                    method: 'GET',
                    headers: [],
                    body: [],
                    rawContent: null,
                    bodyInputType: 'keyValue',
                    params: [],
                    mapping: [],
                    success_id: '',
                    failure_id: ''
                };
            } else if (type === 'capture') {
                node.addInPort(' ');
                node.addOutPort(' ').setMaximumLinks(1);
                node.extras = {
                    variable: null
                };
            } else if (type === 'mail') {
                node.addInPort(' ');
                node.addOutPort(' ').setMaximumLinks(1);
                node.addOutPort('fail').setMaximumLinks(1);
                node.extras = {
                    template_id: null,
                    mapping: [],
                    to: ''
                };
            } else if (type === 'stream') {
                node.addInPort(' ');
                node.addOutPort('stop/pause').setMaximumLinks(1);
                node.extras = {
                    audio: '',
                    player: false
                }
            } else if (type === 'permissions') {
                node.addInPort(' ');
                node.addOutPort(' ').setMaximumLinks(1);
                node.addOutPort('fail').setMaximumLinks(1);
                node.addOutPort('declined').setMaximumLinks(1);
                node.extras = {
                    permissions: []
                };
            } else if (type === 'module'){
                node.addInPort(' ');
                node.addOutPort(' ').setMaximumLinks(1);

                try{
                    let data = JSON.parse(event.dataTransfer.getData('data'));
                    let inputs = data.input ? JSON.parse(data.input) : [];
                    let outputs = data.output ? JSON.parse(data.output) : [];

                    node.name = data.title ? data.title : 'Module';

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
                    console.error(err);
                    return this.setState({
                        error_modal: 'Error - Module Broken'
                    });
                }
            }
            this.state.engine.stopMove();
            node.extras.type = type;
            var points = engine.getRelativeMousePoint(event);
            node.x = points.x-(node.name.length*4.5 + 40);
            node.y = points.y-30;
            node.setSelected();
            engine.getDiagramModel().clearSelection();
            engine.getDiagramModel().addNode(node);
            engine.setSuperSelect(node);
            this.setState({
                engine: engine,
                open: type !== 'comment'
            });
        }
    }

    render() {
        // if(this.state.loading_modal) {
        //     return <div className='super-center h-100 w-100'>
        //         <div className="text-center">
        //             <h1><img className="fa-spin" src='/sync.svg' height='42' width='42' alt='loading'/></h1>
        //             <h5>Loading...</h5>
        //         </div>
        //     </div>
        // }

        return (
            <div className='App' >
                <HelpModal
                    open={this.state.helpOpen}
                    help={this.state.help}
                    toggle={()=>this.setState({helpOpen: !this.state.helpOpen})}
                    setHelp={(help) => this.setState({help: help})}
                />
                { this.state.newSkill !== null ?  
                    <SkillModal 
                        modal={!!this.state.newSkill}
                        toggle={()=>this.setState({newSkill: false})} 
                        createSkill={this.createSkill}
                        onClose={this.state.newSkill === false ? 
                            () => this.props.history.push('/dashboard') : 
                            () => this.setState({newSkill: null})}
                    /> : null
                }
                <Prompt
                    when={!this.state.saved}
                    message={location => 'Are you sure you want to leave without saving?'
                    }
                />
                <LoadingModal open={this.state.loading_modal} error={this.state.error_modal} dismiss={this.dismissLoadingModal}/>
                {!!this.state.template_confirm && <ConfirmModal confirm={this.state.template_confirm} toggle={this.toggleTemplateConfirm}/>}

                {this.state.testing_modal ? 
                    <TestModal 
                        open={this.state.testing_modal} 
                        toggle={this.toggleTestModal} 
                        testing_info={this.state.testing_info} 
                        diagrams={this.state.diagrams}
                    /> 
                : null}
                <Menu 
                    helpModal={() => this.setState({help: true, helpOpen: true})}
                    diagrams={this.state.diagrams}
                    current={this.state.diagram_id}
                    enterFlow={this.enterFlow}
                    variables={this.state.variables}
                    onVariable={this.setVariables}
                    build={fn => this.buildDiagrams = fn}
                    user_modules={this.state.user_modules}
                    user_templates={this.state.user_templates}
                    onTemplateChoice={this.handleTemplateChoice}
                />
                <TitleBar
                    lastSave={(this.state.saved ? "" : "*") + (this.state.last_save ? "last saved " + moment(this.state.last_save).fromNow() : "- last save -")}
                    preview={this.preview}
                    title={this.state.diagram_name}
                    skill={this.state.skill}
                    onSave={this.onSave}
                    onTest={this.onTest}
                    saving={this.state.saving}
                    saved={this.state.saved}
                    last_save={this.state.last_save}
                    admin={this.state.admin}
                    onLoadLines={this.loadLines}
                    publishAMZN={this.publishAMZN}
                    publishMarket={this.publishMarket}
                    diagram_id={this.state.diagram_id}
                />
                <div
                    id="diagram"
                    className={this.preview ? " no-padding" : ""}
                    onDrop={this.onDrop}
                    onDragOver={e => e.preventDefault()}
                >
                    <div id="widget-bar">
                        <ButtonGroup>
                            <Button onClick={()=>this.zoom(1000)} color="primary"><i className="far fa-plus"/></Button>
                            <Button onClick={()=>this.zoom(-1000)} color="primary"><i className="far fa-minus"/></Button>
                        </ButtonGroup>
                    </div>
                    <SRD.DiagramWidget
                        diagramEngine={this.state.engine} 
                        allowLooseLinks={false}
                    />
                </div>
                <Editor
                    open={this.state.open}
                    node={this.state.engine.getSuperSelect()}
                    onUpdate={this.unsave}
                    close={e => this.setState({ open: false })}
                    repaint={this.repaint}
                    variables={this.state.variables}
                    setHelp={(help) => this.setState({help: help, helpOpen: true})}
                    diagrams={this.state.diagrams}
                    createDiagram={this.createDiagram}
                    enterFlow={this.enterFlow}
                    removeNode={this.removeNode}
                    user_modules={this.state.user_modules}
                />
            </div>
        );
    }
}

export default Canvas;

