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
import SkillModal from './../Dashboard/Skill/SkillModal';
import TestModal from './Test/TestModal';
import { Prompt } from 'react-router';

import Cookies from 'universal-cookie';

import { BlockNodeModel } from './SRD/models/BlockNodeModel';
import { BlockLinkFactory } from './SRD/factories/BlockLinkFactory';
import { BlockPortFactory } from './SRD/factories/BlockPortFactory';
import { BlockNodeFactory } from './SRD/factories/BlockNodeFactory';
// import { DiagramWidget } from './SRD/base/widgets/DiagramWidget';

const cookies = new Cookies();

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
        this.onNodeRemoved = this.onNodeRemoved.bind(this);
        this.onDiagramUnfocus = this.onDiagramUnfocus.bind(this);
        this.unsave = this.unsave.bind(this);

        var engine = new SRD.DiagramEngine();
        engine.registerLabelFactory(new SRD.DefaultLabelFactory());
        engine.registerNodeFactory(new BlockNodeFactory());
        engine.registerLinkFactory(new BlockLinkFactory());
        engine.registerPortFactory(new BlockPortFactory());
        
        let node, open, diagram_id, skill_id;

        let last_session = cookies.get('last_session');
        let url = this.props.computedMatch;

        let newSkill = !!this.props.new;

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

        if(!diagram_id || !skill_id){
            newSkill = true;

            var model = new SRD.DiagramModel();

            diagram_id = model.getID();

            node = new BlockNodeModel('Start Block', '#FBE9E7');
            node.addOutPort(' ').setMaximumLinks(1);
            node.extras = {
                audio: '',
                audioText: '',
                audioVoice: '',
                preview: '',
                previewText: '',
                previewVoice: '',
                prompt: '',
                promptText: '',
                promptVoice: ''
            };
            node.extras.type = 'story';
            node.addListener({ entityRemoved: e => {e.stopPropagation();} });
            node.setPosition($(window).width()/3-32, $(window).height()/2-21);
            node.setSelected();
            model.addNode(node);
            engine.setDiagramModel(model);
            engine.setSuperSelect(node);

            open = true;

            model.addListener({nodesUpdated: this.unsave});
            model.addListener({linksUpdated: this.unsave});
        }

        this.state = {
            engine: engine,
            open: open,
            diagram_name: '',
            skill: {
                skill_id: skill_id,
                name: '...'
            },
            diagram_id: diagram_id,
            loading_modal: !newSkill,
            error_modal: false,
            saving: false,
            saved: true,
            last_save: false,
            testing_modal: false,
            testing_info: false,
            variables: [],
            newSkill: newSkill
        };

        $('.Editor').mousedown(this.onDiagramUnfocus);

        if(!this.state.newSkill){
            this.onLoadSkill(this.state.skill.skill_id);
        } 
    }

    componentDidMount() {

        $('.srd-node-layer').click(() => {
            let engine = this.state.engine;
            let selected = engine.getDiagramModel().getSelectedItems("node");
            // console.log(selected);
            if (selected.length === 1) {
                engine.setSuperSelect(selected[0]);
                this.setState({
                    engine: engine,
                    open: true
                }, () => $('.Editor').mousedown(this.onDiagramUnfocus));
            }
        });

        // $('.Menu').mousedown(this.onDiagramUnfocus)

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

    onDiagramUnfocus() {
        let engine = this.state.engine;
        if(engine.hasRepaint()){
            engine.getDiagramModel().clearSelection();

            this.setState({
                engine: engine
            });
        }
    }

    onNodeRemoved(e) {
        if (this.state.selected && e.entity.getID() === this.state.selected.getID()) {
            this.setState({
                selected: null,
                open: false
            });
        }
    }

    repaint() {
        // this.state.engine.repaintCanvas();
    }

    onSave(cb) {
        try {
            this.setState({ saving: 'Saving...' });
            var engine = this.state.engine;
            var model = engine.getDiagramModel();
            let id = model.getID();
            var data = JSON.stringify(model.serializeDiagram());
            // model.deSerializeDiagram(JSON.parse(data), engine);

            var diagram = {
                id: id,
                title: this.state.diagram_name,
                variables: this.state.variables,
                data: data,
                skill: this.state.skill.skill_id
            }

            // console.log(diagram);

            $.ajax({
                url: '/diagram',
                type: 'POST',
                data: diagram,
                success: () => {
                    // this.onLoad();
                    this.setState({
                        saving: false,
                        saved: true,
                        last_save: Date.now()
                    });
                    if(typeof cb === "function") cb(id);
                },
                error: () => {
                    this.setState({
                        saving: false,
                        loading_modal: true,
                        error_modal: 'Error Saving to Cloud (Check Logs)'
                    });
                    if(typeof cb === "function") cb(null);
                }
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
            engine.setDiagramModel(model);

            let variables = []
            if (diagram.variables) {
                variables = diagram.variables;
            }

            this.setState({
                open: false,
                engine: engine,
                diagram_name: diagram.title ? diagram.title : 'Unnamed Story',
                last_save: diagram.last_save,
                loading_modal: false,
                variables: variables
            });

            this.setState({ saved: true });
        } else {
            this.setState({ error_modal: 'Could Not Open Project - Corrupted File' });
        }
    }

    onLoadSkill(skill_id){
        $.ajax({
            url: '/skill/'+skill_id,
            type: 'GET',
            success: skill => {
                this.setState({
                    skill: skill
                }, this.onLoadId(this.state.diagram_id));
            },
            error: () => {this.setState({ error_modal: 'Could Not Retrieve Project' });}
        });
    }

    onLoadId(diagram_id) {
        $.ajax({
            url: '/diagram/'+diagram_id,
            type: 'GET',
            success: diagram => {
                this.loadDiagram(diagram);

                cookies.set('last_session', {
                    skill_id: this.state.skill.skill_id,
                    diagram_id: diagram_id
                }, {path: '/'});
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

    unsave() {
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

    onTest() {
        this.state.engine.getDiagramModel().clearSelection();
        this.toggleTestModal();

        this.onSave(diagram_id => {
            axios.post(`/diagram/${diagram_id}/test/publish`)
            .then(() => {
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
                        id: diagram_id,
                        nodes: nodes
                    }
                });
            })
            .catch(err => {
                console.log(err.response);
                this.setState({
                    error_modal: "Could Not Render Your Project",
                    loading_modal: true,
                    testing_modal: false
                });
            });
        });
    }

    createSkill(name){
        if(!name){
            name = 'New Skill';
        }
        this.onSave(diagram_id => {
            if(diagram_id){
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
                        newSkill: 0,
                        skill: {
                            skill_id: skill_id,
                            name: name
                        },
                        diagram_id: diagram_id
                    });
                })
                .catch(err => {
                    this.setState({ error_modal: 'Could Not Create Project - Error' });
                })
            }
        });
    }

    publish() {
        this.onSave(diagram_id => {
            this.props.history.push('/publish/' + this.state.skill.skill_id);
        });
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
                    lastSave ={(this.state.saved ? "" : "*") + (this.state.last_save ? "Saved " + moment(this.state.last_save).fromNow() : "Last Save")}
                />
                <TitleBar
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
                    className="diagram-layer"
                    onDrop={event => {
                        var engine = this.state.engine;
                        try {
                            var type = event.dataTransfer.getData('node');
                        } catch (e) {
                            return;
                        }
                        var upper = type.charAt(0).toUpperCase() + type.substr(1);
                        var node = new BlockNodeModel(upper);
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
                                raw: null
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
                        } else if (type === 'set') {
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
                        } else if (type === 'capture') {
                            node.addInPort(' ');
                            node.addOutPort(' ').setMaximumLinks(1);
                            node.extras = {
                                variable: null
                            };
                        }
                        node.extras.type = type;
                        node.addListener({ entityRemoved: this.onNodeRemoved });
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
                        }, () => $('.Editor').mousedown(this.onDiagramUnfocus));
                    }}
                    onDragOver={event => {
                        event.preventDefault();
                    }}
                >
                    <SRD.DiagramWidget diagramEngine={this.state.engine} allowLooseLinks={false}/>
                </div>
                <Editor
                    open={this.state.open}
                    node={this.state.engine.getSuperSelect()}
                    onUpdate={this.unsave}
                    onClose={e => this.setState({ open: false })}
                    repaint={this.repaint}
                    variables={this.state.variables}
                    onVariable={this.setVariables}
                />
            </div>
        );
    }
}

export default StoryBoard;
