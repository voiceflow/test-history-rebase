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

import { BlockNodeModel } from './SRD/BlockNodeModel';

class StoryBoard extends Component {
    constructor(props) {
        super(props);

        var engine = new SRD.DiagramEngine();
        engine.installDefaultFactories();

        var model = new SRD.DiagramModel();

        var node = new BlockNodeModel('New Story', 'white');
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
            last_save: false
        };

        this.unsave = this.unsave.bind(this);

        model.addListener({nodesUpdated: this.unsave});
        model.addListener({linksUpdated: this.unsave});
        
        $('.Editor').mousedown(this.onDiagramUnfocus.bind(this));

        this.onLoad = this.onLoad.bind(this);
        this.dismissLoadingModal = this.dismissLoadingModal.bind(this);
    }

    componentDidMount() {
        this.onLoad();
        let split = this.props.location.pathname.split('/');
        
        if(split.length === 3){
            this.onLoadId(split[2], true);
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
                url: '/diagrams',
                type: 'POST',
                data: diagram,
                success: () => {
                    this.onLoad();
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
            url: '/publish/staging/'+id,
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

    onPublish() {
        var id = this.state.engine.getDiagramModel().getID();
        if (window.confirm('Are you ready to publish?')) {
            $.ajax({
                url: '/publish/production/'+id,
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

    onLoadId(id, url) {
        if(!!!url){
            this.props.history.push('/storyboard/' + id);
        }
        this.setState({loading_modal: true, error_modal: false});
        $.ajax({
            url: '/diagrams/'+id,
            type: 'GET',
            success: diagram => {
                var engine = this.state.engine;
                var model = new SRD.DiagramModel();

                let diagram_json = false;
                try {
                    diagram_json = JSON.parse(diagram.data);
                } catch (e) {
                    console.log(e);
                }
                if(diagram_json){
                    model.deSerializeDiagram(JSON.parse(diagram.data), engine);
                    model.addListener({nodesUpdated: this.unsave});
                    model.addListener({linksUpdated: this.unsave});
                    var nodes = model.getNodes();
                    for (var key in nodes) {
                        if (nodes[key].extras.type === 'story') {
                            nodes[key].clearListeners();
                            nodes[key].addListener({ entityRemoved: e => {e.stopPropagation();} });
                        }
                    }
                    engine.setDiagramModel(model);
                    let title = diagram.title ? diagram.title : "Unnamed Story";

                    this.setState({
                        engine: engine,
                        title: title,
                        last_save: diagram.last_save,
                        loading_modal: false,
                    });

                    this.setState({saved: true});
                }else{
                    this.setState({error_modal: "Could Not Open Project - Corrupted File"});
                }
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
            <div className='App'>
                <Prompt
                    when={!this.state.saved}
                    message={location =>
                        `Are you sure you want to leave without saving?`
                    }
                ></Prompt>
                <LoadingModal open={this.state.loading_modal} error={this.state.error_modal} dismiss={this.dismissLoadingModal}/>
                <Menu items={[
                    { text: 'Choice', type: 'choice', color: '#E8F5E9', menuColor: '#66BB6A' },
                    { text: 'Line', type: 'line', color: '#E1F5FE', menuColor: '#29B6F6' },
                    { text: 'Listen', type: 'listen', color: '#FFFDE7', menuColor: '#FBC02D' },
                    { text: 'Retry', type: 'retry', color: '#FFF3E0', menuColor: '#FFA726' },
                    { text: 'Ending', type: 'ending', color: '#FBE9E7', menuColor: '#FF7043' },
                    { text: 'Comment', type: 'comment', color: 'rgba(255,255,255,0.5)', menuColor: '#BDBDBD' }
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
                />
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
                        if (data.type === 'choice') {
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
                        } else if (data.type === 'line') {
                            node.addInPort(' ');
                            node.addOutPort(' ').setMaximumLinks(1);
                            node.extras = {
                                audio: '',
                                audioText: '',
                                audioVoice: ''
                            };
                        } else if (data.type === 'listen') {
                            node.addInPort(' ');
                            node.addOutPort(' ').setMaximumLinks(1);
                            node.extras = {
                                audio: '',
                                audioText: '',
                                audioVoice: '',
                                prompt: '',
                                promptText: '',
                                promptVoice: ''
                            };
                        } else if (data.type === 'retry') {
                            node.addInPort(' ');
                            node.addOutPort(' ').setMaximumLinks(1);
                            node.extras = {
                                audio: '',
                                audioText: '',
                                audioVoice: ''
                            };
                        } else if (data.type === 'ending') {
                            node.addInPort(' ');
                            node.extras = {
                                audio: '',
                                audioText: '',
                                audioVoice: ''
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
                { this.state.selected ? 
                <div className={'Editor' + (this.state.open ? ' open' : '') }>
                     <Editor node={this.state.selected} onUpdate={this.unsave} onClose={e => this.setState({ open: false })} />
                </div> : null }
            </div>
        );
    }
}

export default StoryBoard;
