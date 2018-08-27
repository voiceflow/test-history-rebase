import React, { Component } from 'react';
import $ from 'jquery';
import * as SRD from 'storm-react-diagrams';
import Menu from './Menu';
import Editor from './Editor';
// import Loader from './Loader';
import 'storm-react-diagrams/dist/style.min.css';
import './StoryBoard.css';
import TitleBar from './TitleBar';
import LoadingModal from './../../components/Modals/LoadingModal';
import { Prompt } from 'react-router'

import { BlockNodeModel } from './SRD/models/BlockNodeModel';
import { BlockLinkFactory } from './SRD/factories/BlockLinkFactory'
import { BlockPortFactory } from './SRD/factories/BlockPortFactory'
import { BlockNodeFactory } from './SRD/factories/BlockNodeFactory'

import AuthenticationService from "./../../../services/Authentication";

class StoryBoard extends Component {
    constructor(props) {
        super(props);

        var engine = new SRD.DiagramEngine();
        engine.registerLabelFactory(new SRD.DefaultLabelFactory());
        engine.registerNodeFactory(new BlockNodeFactory());
        engine.registerLinkFactory(new BlockLinkFactory());
        engine.registerPortFactory(new BlockPortFactory());

        let split = this.props.location.pathname.split('/');

        this.unsave = this.unsave.bind(this);
        
        if(split.length === 2 && split[1].toLowerCase() === "storyboard"){
            var model = new SRD.DiagramModel();

            var node = new BlockNodeModel('Start', '#FBE9E7');
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

            this.state = {
                engine: engine,
                selected: node,
                open: true,
                diagrams: [],
                title: "",
                loading_modal: false,
                error_modal: false,
                saving: false,
                saved: true,
                last_save: false,
                admin: false,
                review: false
            };

            model.addListener({nodesUpdated: this.unsave});
            model.addListener({linksUpdated: this.unsave});
        }else{
            this.state = {
                engine: engine,
                selected: null,
                open: false,
                diagrams: [],
                title: "",
                loading_modal: false,
                error_modal: false,
                saving: false,
                saved: true,
                last_save: false,
                admin: false,
                review: false
            };     
        }

        $('.Editor').mousedown(this.onDiagramUnfocus.bind(this));

        this.onLoad = this.onLoad.bind(this);
        this.repaint = this.repaint.bind(this);
        this.dismissLoadingModal = this.dismissLoadingModal.bind(this);
        this.loadDiagram = this.loadDiagram.bind(this);

        AuthenticationService.check((err, res) => {
            if(err && this.props.history){
              this.props.history.push('/login');
            }else{
              this.setState({ admin: res.admin });
            }
        });
    }

    componentDidMount() {
        this.onLoad();
        let split = this.props.location.pathname.split('/');
        
        if(split.length === 3){
            this.onLoadId(split[2], true);
        }else if(split.length === 4 && split[2] === 'review'){
            this.onLoadReview(split[3]);
        }
        
        $('.srd-node-layer').click(() => {
            var engine = this.state.engine;
            var node = engine.getDiagramModel().getNode($('.srd-node--selected').data('nodeid'));
            if(node){
                this.setState({
                    engine: engine,
                    selected: node,
                    open: true,
                }, () => $('.Editor').mousedown(this.onDiagramUnfocus.bind(this)));
            }
        });

        $('.Menu').mousedown(this.onDiagramUnfocus.bind(this));

        $(document).keydown(function(event) {
                // If Control or Command key is pressed and the S key is pressed
                // run save function. 83 is the key code for S.
                if((event.ctrlKey || event.metaKey) && event.which === 83) {
                    event.preventDefault();
                    // Save Function
                    if(!this.state.saved){
                        this.onSave();
                    }
                    return false;
                };
            }.bind(this)
        );
    }

    onDiagramUnfocus() {
        var engine = this.state.engine;
        engine.getDiagramModel().clearSelection();
        this.setState({
            engine: engine
        });
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
        this.state.engine.repaintCanvas();
    }

    onSave() {
        try {
            this.setState({saving: "Saving..."});
            var engine = this.state.engine;
            var model = engine.getDiagramModel();
            var data = model.serializeDiagram();
            model.deSerializeDiagram(JSON.parse(JSON.stringify(data)), engine);

            var diagram = {
                id: data.id,
                title: this.state.title,
                data: JSON.stringify(data),
            }

            $.ajax({
                url: this.state.review ? '/review' : '/diagram',
                type: 'POST',
                data: diagram,
                success: () => {
                    // this.onLoad();
                    this.setState({
                        saving: false,
                        saved: true,
                        last_save: Date.now()
                    });
                },
                error: () => {
                    this.setState({
                        saving: false,
                        loading_modal: true,
                        error_modal: "Error Saving to Cloud (Check Logs)"
                    });
                }
            });
        } catch (e) {
            console.log(e);
            this.setState({
                loading_modal: true,
                error_modal: "Error Saving - Project Structure (Check Logs)"
            });
        }
    }

    onLoad() {
        $.ajax({
            url: '/diagrams',
            type: 'GET',
            success: data => {
                this.setState({
                    diagrams: data
                }, () => $('.Loader').mousedown(this.onDiagramUnfocus.bind(this)));
            },
            error: (e) => {
                console.log(e);
            }
        });
    }

    onTest() {
        var id = this.state.engine.getDiagramModel().getID();
        $.ajax({
            url: this.state.review ? ('/publish/review/staging/'+id) : ('/publish/staging/'+id),
            type: 'POST',
            success: () => {window.alert('Success');},
            error: (e) => {
                console.log(e);
                this.setState({
                    loading_modal: true,
                    error_modal: "Server Error - Unable to Test"
                });
            }
        });
    }

    onPublish(env) {
        if(!["production", "sandbox"].includes(env)) return;
        var id = this.state.engine.getDiagramModel().getID();
        if (window.confirm('Are you ready to publish?')) {
            $.ajax({
                url: this.state.review ? ('/publish/review/' + env + '/' + id) : ('/publish/' + env + '/' + id),
                type: 'POST',
                success: () => {window.alert('Success');},
                error: (e) => {
                    console.log(e);
                    this.setState({
                        loading_modal: true,
                        error_modal: "Server Error - Unable to Publish"
                    });
                }
            });
        }
    }

    loadDiagram(diagram, review) {
        var engine = this.state.engine;
        var model = new SRD.DiagramModel();

        let diagram_json = false;
        try {
            diagram_json = JSON.parse(diagram.data);
        } catch (e) {
            console.log(e);
        }
        if(diagram_json){
            model.deSerializeDiagram(diagram_json, engine);
            model.addListener({nodesUpdated: this.unsave});
            model.addListener({linksUpdated: this.unsave});
            var nodes = model.getNodes();
            for (let key in nodes) {
                if (nodes[key].extras.type === 'story') {
                    nodes[key].clearListeners();
                    nodes[key].addListener({ entityRemoved: e => {e.stopPropagation();} });
                }
            }
            var links = model.getLinks();
            for (let key in links) {
                links[key].setColor("#CCC");
            }
            engine.setDiagramModel(model);
            let title = diagram.title ? diagram.title : "Unnamed Story";

            if(!review){
                review = false;
            }else{
                review = {
                    name: diagram.name,
                    email: diagram.email,
                    envs: diagram.envs
                }
            }

            this.setState({
                open: false,
                engine: engine,
                title: title,
                last_save: diagram.last_save,
                loading_modal: false,
                review: review
            });

            this.setState({saved: true});
        }else{
            this.setState({error_modal: "Could Not Open Project - Corrupted File"});
        }
    }

    onLoadId(id, url) {
        if(!!!url){
            this.props.history.push('/storyboard/' + id);
        }
        this.setState({loading_modal: true, error_modal: false});
        $.ajax({
            url: '/diagram/'+id,
            type: 'GET',
            success: diagram => {
                this.loadDiagram(diagram);
            },
            error: () => {this.setState({error_modal: "Could Not Retrieve Project"});}
        });
    }

    onLoadReview(id) {
        // this.props.history.push('/storyboard/' + id);
        this.setState({loading_modal: true, error_modal: false});
        $.ajax({
            url: '/review/'+id,
            type: 'GET',
            success: diagram => {
                this.loadDiagram(diagram, true);
            },
            error: () => {this.setState({error_modal: "Could Not Retrieve Project"});}
        });
    }

    dismissLoadingModal() {
        this.setState({
            loading_modal: false
        });
        this.props.history.push('/storyboard');
    }

    unsave() {
        if(this.state.saved){
            this.setState({saved: false});
        }
    }

    render() {
        return (
            <div className={'App' + (this.state.review ? " review" : "")} >
                <Prompt
                    when={!this.state.saved}
                    message={location =>
                        `Are you sure you want to leave without saving?`
                    }
                ></Prompt>
                <LoadingModal open={this.state.loading_modal} error={this.state.error_modal} dismiss={this.dismissLoadingModal}/>
                <Menu items={[
                    { text: 'Choice', type: 'choicenew', color: '#E8F5E9', menuColor: '#66BB6A' },
                    { text: 'Line', type: 'multiline', color: '#E1F5FE', menuColor: '#29B6F6' },
                    { text: 'Ending', type: 'ending', color: '#FBE9E7', menuColor: '#FF7043' },
                    'hr',
                    { text: 'Random', type: 'random', color: '#FFFDE7', menuColor: '#FBC02D' }
                ]} />
                <TitleBar 
                    title={this.state.title} 
                    onUpdateTitle={(e) => {this.setState({title: e.target.value}); this.unsave()}}
                    onSave={this.onSave.bind(this)} 
                    onLoad={this.onLoad.bind(this)} 
                    onTest={this.onTest.bind(this)} 
                    onPublish={this.onPublish.bind(this)}
                    diagrams={this.state.diagrams}
                    onLoadId={this.onLoadId.bind(this)}
                    saving={this.state.saving}
                    saved={this.state.saved}
                    last_save={this.state.last_save}
                    admin={this.state.admin}
                />
                { this.state.review ? 
                    <div id="review">
                        <h5 className="mb-0">Review Mode</h5>
                        <small><b>Requested Environments:</b><br/>
                            {Array.isArray(this.state.review.envs) ? this.state.review.envs.map((env, i) => {
                                return <span key={i}>* {env}<br/></span>
                            }) : null}
                        </small>
                        <small>
                        <i>{this.state.review.name ? this.state.review.name : "No Account Name"}</i><br/>
                        <i>{this.state.review.email}</i>
                        </small>
                    </div> : null
                }
                <div
                    className="diagram-layer"
                    onDrop={event => {
                        var engine = this.state.engine;
                        try {
                            var data = JSON.parse(event.dataTransfer.getData('node'));
                        } catch (e) {
                            return;
                        }
                        var node = new BlockNodeModel('New '+data.text, data.color);
                        if (data.type === 'choicenew') {
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
                        } else if (data.type === 'multiline') {
                            node.addInPort(' ');
                            node.addOutPort(' ').setMaximumLinks(1);
                            node.extras = {
                                audio: false,
                                lines: [{
                                    textCollapse: false,
                                    collapse: true,
                                    text: '',
                                    audio: false,
                                    voice: false,
                                    title: 'Line Audio'
                                }],
                            };
                        } else if (data.type === 'ending') {
                            node.addInPort(' ');
                            node.extras = {
                                audio: '',
                                audioText: '',
                                audioVoice: ''
                            };
                        } if (data.type === 'random') {
                            node.addInPort(" ");
                            node.addOutPort(1).setMaximumLinks(1);
                            node.extras = {
                                paths: 1
                            };
                        }
                        node.extras.type = data.type;
                        node.addListener({ entityRemoved: this.onNodeRemoved.bind(this) });
                        var points = engine.getRelativeMousePoint(event);
                        node.x = points.x;
                        node.y = points.y;
                        node.setSelected();
                        engine.getDiagramModel().clearSelection();
                        engine.getDiagramModel().addNode(node);
                        this.setState({
                            engine: engine,
                            selected: node,
                            open: true
                        }, () => $('.Editor').mousedown(this.onDiagramUnfocus.bind(this)));
                    }}
                    onDragOver={event => {
                        event.preventDefault();
                    }}
                >
                    <SRD.DiagramWidget diagramEngine={this.state.engine} allowLooseLinks={false}/>
                </div>
                <div className={'Editor' + (this.state.open ? ' open' : '') }>
                     <Editor 
                        node={this.state.selected} 
                        onUpdate={this.unsave} 
                        onClose={e => this.setState({ open: false })} 
                        repaint={this.repaint}
                    />
                </div>
            </div>
        );
    }
}

export default StoryBoard;
