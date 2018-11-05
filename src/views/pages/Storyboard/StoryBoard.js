import React, { Component } from 'react';
import $ from 'jquery';
import * as SRD from 'storm-react-diagrams';
import Menu from './Menu';
import Editor from './Editor';
import moment from 'moment';
import axios from 'axios';
// import Loader from './Loader';
import 'storm-react-diagrams/dist/style.min.css';
import './StoryBoard.css';
import TitleBar from './TitleBar';
import LoadingModal from './../../components/Modals/LoadingModal';
import HelpModal from './HelpModal';
import SkillModal from './../Dashboard/Skill/SkillModal';
import TestModal from './Test/TestModal';
import { Prompt } from 'react-router';
import blank_template from './../../../assets/templates/blank';
import new_template from './../../../assets/templates/new';

import Cookies from 'universal-cookie';

import { BlockNodeModel } from './SRD/models/BlockNodeModel';
import { BlockLinkFactory } from './SRD/factories/BlockLinkFactory';
import { BlockPortFactory } from './SRD/factories/BlockPortFactory';
import { BlockNodeFactory } from './SRD/factories/BlockNodeFactory';
// import { DiagramWidget } from './SRD/base/widgets/DiagramWidget';

const cookies = new Cookies();

const generateID = () => {
    return "xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

class StoryBoard extends Component {
    constructor(props) {
        super(props);

        this.loadLines = this.loadLines.bind(this);
        this.repaint = this.repaint.bind(this);
        this.dismissLoadingModal = this.dismissLoadingModal.bind(this);
        this.loadDiagram = this.loadDiagram.bind(this);
        this.setVariables = this.setVariables.bind(this);
        this.toggleTestModal = this.toggleTestModal.bind(this);
        this.createSkill = this.createSkill.bind(this);
        this.publish = this.publish.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onTest = this.onTest.bind(this);
        this.onDiagramUnfocus = this.onDiagramUnfocus.bind(this);
        this.unsave = this.unsave.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.runTest = this.runTest.bind(this);
        this.createDiagram = this.createDiagram.bind(this);
        this.enterFlow = this.enterFlow.bind(this);
        this.removeNode = this.removeNode.bind(this);
        this.buildDiagrams = null;

        // preview mode
        this.preview = !!this.props.preview;

        var engine = new SRD.DiagramEngine();
        engine.registerLabelFactory(new SRD.DefaultLabelFactory());
        engine.registerNodeFactory(new BlockNodeFactory());
        engine.registerLinkFactory(new BlockLinkFactory());
        engine.registerPortFactory(new BlockPortFactory());
        
        let open, diagram_id, skill_id;
        let diagram_name = '';

        let last_session = cookies.get('last_session', {path: '/'});
        let url = this.props.computedMatch;

        let newSkill = !!this.props.new;
        let variables = [];

        if(!newSkill){
            if (url && url.params.skill_id && url.params.diagram_id) {
                skill_id = url.params.skill_id;
                diagram_id = url.params.diagram_id;
            }else if(last_session){
                this.props.history.push('/storyboard/' + last_session.skill_id + '/' + last_session.diagram_id);
                skill_id = last_session.skill_id;
                diagram_id = last_session.diagram_id;
            }else{
                this.props.history.push('/storyboard/new');
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
                if (nodes[key].extras.type === 'story') {
                    nodes[key].clearListeners();
                    nodes[key].addListener({ entityRemoved: e => {e.stopPropagation();} });
                }
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
            help: null
        };

        if(!this.state.newSkill){
            this.onLoadSkill(this.state.skill.skill_id);
            // this.onLoadId('6cd76bb5-6d47-454f-b393-fb6bcb6505fe');
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
            // console.log(selected);
            if (selected.length === 1) {
                engine.setSuperSelect(selected[0]);
                this.setState({
                    engine: engine,
                    open: true
                });
            }
        });

        $('#Editor').mousedown(this.onDiagramUnfocus);

        if(this.preview){
            $('#Editor').on('click dblclick focus focusin focusout keydown keypress keyup load mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup select submit', 
                '#editor-section', 
                function(e){
                e.preventDefault();
                return false;
            });
        }else{
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

    onDiagramUnfocus() {
        this.state.engine.getDiagramModel().clearSelection();
    }

    repaint() {
        this.state.engine.repaintCanvas();
        // console.log("repaint", this.state.engine.getSuperSelect().extras.type);
        // this.setState({
        //     engine: this.state.engine
        // });
    }

    onSave(cb) {
        try {
            this.setState({ saving: 'Saving...' });
            var engine = this.state.engine;
            var model = engine.getDiagramModel();
            let serialize = model.serializeDiagram();
            serialize.id = this.state.diagram_id;
            var data = JSON.stringify(serialize);

            let sub_diagrams = [];
            for(let node of serialize.nodes){
                if(node.extras.type === 'flow' && node.extras.diagram_id){
                    sub_diagrams.push(node.extras.diagram_id);
                }
            }

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

            // model.deSerializeDiagram(JSON.parse(data), engine);

            var diagram = {
                id: this.state.diagram_id,
                title: this.state.diagram_name,
                variables: this.state.variables,
                data: data,
                skill: this.state.skill.skill_id,
                sub_diagrams: JSON.stringify(sub_diagrams)
            }

            axios.post('/diagram', diagram)
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
                if (nodes[key].extras.type === 'story') {
                    nodes[key].clearListeners();
                    nodes[key].addListener({ entityRemoved: e => {e.stopPropagation();} });
                }
            }
            var links = model.getLinks();
            for (let key in links) {
                links[key].setColor('#E3E9EE');
            }
            
            engine.stopMove();
            engine.setDiagramModel(model);

            let variables = []
            if (diagram.variables) {
                variables = diagram.variables;
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
        this.props.history.push('/dashboard');
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
                    name: name
                },
                newSkill: 0,
                diagram_id: diagram_id
            }, () => {
                this.onSave(() => {
                    this.state.diagrams.push({
                        id: diagram_id,
                        name: 'ROOT'
                    });
                    this.props.history.push(`/storyboard/${skill_id}/${diagram_id}`);
                })
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
                variables: [],
                data: data,
                skill: skill_id
            }

            axios.post('/diagram', diagram)
            .then(() => {
                this.state.diagrams.push({
                    name: 'New Flow',
                    id: id
                });
                this.props.history.push(`/storyboard/${skill_id}/${id}`);
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

    publish() {
        this.onSave(diagram_id => {
            this.props.history.push('/publish/' + this.state.skill.skill_id);
        });
    }

    enterFlow(new_diagram_id) {
        if(new_diagram_id !== this.state.diagram_id){
            this.onSave(() => {
                this.props.history.push(`/storyboard/${this.state.skill.skill_id}/${new_diagram_id}`);
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

        var node;
        if(type === 'api'){
            node = new BlockNodeModel('API')
        }else{
            node = new BlockNodeModel(type.charAt(0).toUpperCase() + type.substr(1));
        }

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
                            textCollapse: false,
                            collapse: true,
                            text: '',
                            audio: false,
                            voice: false,
                            title: 'Line Audio'
                        }
                    ]
                };
            } else if (type === 'speak') {
                node.addInPort(' ');
                node.addOutPort(' ').setMaximumLinks(1);
                node.extras = {
                    rawContent: null
                };
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
            } else if (type === 'set' || type === 'variable') {
                node.addInPort(' ');
                node.addOutPort(' ').setMaximumLinks(1);
                node.extras = {
                    variable: null,
                    expression: ""
                };
            } else if (type === 'if') {
                node.addInPort(' ');
                node.addOutPort('true').setMaximumLinks(1);
                node.addOutPort('false').setMaximumLinks(1);
                node.extras = {
                    variable: null,
                    operation: '==',
                    expression: ""
                };
            } else if (type === 'api') {
                node.addInPort(' ');
                node.addOutPort(' ').setMaximumLinks(1);
                node.addOutPort('fail').setMaximumLinks(1);
                node.extras = {
                    url: '',
                    method: 'GET',
                    inputs: [],
                    outputs: []
                };
            } else if (type === 'capture') {
                node.addInPort(' ');
                node.addOutPort(' ').setMaximumLinks(1);
                node.extras = {
                    variable: null
                };
            }
            this.state.engine.stopMove();
            node.extras.type = type;
            var points = engine.getRelativeMousePoint(event);
            node.x = points.x;
            node.y = points.y;
            node.setSelected();
            engine.getDiagramModel().clearSelection();
            engine.getDiagramModel().addNode(node);
            engine.setSuperSelect(node);
            this.setState({
                engine: engine,
                open: true
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
                    help={this.state.help}
                    toggle={()=>this.setState({help: null})}
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
                {this.state.testing_modal ? 
                    <TestModal 
                        open={this.state.testing_modal} 
                        toggle={this.toggleTestModal} 
                        testing_info={this.state.testing_info} /> 
                : null}
                <Menu 
                    lastSave={(this.state.saved ? "" : "*") + (this.state.last_save ? "Saved " + moment(this.state.last_save).fromNow() : "Last Save")}
                    helpModal={() => this.setState({help: true})}
                    diagrams={this.state.diagrams}
                    current={this.state.diagram_id}
                    enterFlow={this.enterFlow}
                    variables={this.state.variables}
                    onVariable={this.setVariables}
                    build={fn => this.buildDiagrams = fn}
                />
                <TitleBar
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
                    publish={this.publish}
                />
                <div
                    id="diagram"
                    className={this.preview ? " no-padding" : ""}
                    onDrop={this.onDrop}
                    onDragOver={e => e.preventDefault()}
                >
                    <SRD.DiagramWidget diagramEngine={this.state.engine} allowLooseLinks={false}/>
                </div>
                <Editor
                    open={this.state.open}
                    node={this.state.engine.getSuperSelect()}
                    onUpdate={this.unsave}
                    close={e => this.setState({ open: false })}
                    repaint={this.repaint}
                    variables={this.state.variables}
                    setHelp={(help) => this.setState({help: help})}
                    diagrams={this.state.diagrams}
                    createDiagram={this.createDiagram}
                    enterFlow={this.enterFlow}
                    removeNode={this.removeNode}
                />
            </div>
        );
    }
}

export default StoryBoard;
