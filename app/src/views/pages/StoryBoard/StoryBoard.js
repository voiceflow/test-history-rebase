import React, { Component } from 'react';
import $ from 'jquery';
import * as SRD from 'storm-react-diagrams';
import Menu from './Menu';
import Editor from './Editor';
// import Loader from './Loader';
import NavBar from './../../components/NavBar/NavBar';
import 'storm-react-diagrams/dist/style.min.css';
import './StoryBoard.css';
import TitleBar from './TitleBar';

class StoryBoard extends Component {
    constructor(props) {
        super(props);

        var engine = new SRD.DiagramEngine();
        engine.installDefaultFactories();

        var model = new SRD.DiagramModel();

        var node = new SRD.DefaultNodeModel('New Story', 'white');
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
            modal: false,
            diagrams: [],
            title: "",
            saving: ""
        };
        
        $('.Editor').mousedown(this.onDiagramUnfocus.bind(this));
        this.toggle = this.toggle.bind(this);
        this.onLoad = this.onLoad.bind(this);

        this.onLoad();
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    componentDidMount() {
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
                    this.setState({saving: "Saved"});
                },
                error: () => {window.alert('Error1');}
            });
        } catch (e) {
            window.alert('Error0');
        }
    }

    onLoad() {
        $.ajax({
            url: '/diagrams',
            type: 'GET',
            success: data => {
                this.setState({
                    modal: true,
                    diagrams: data
                }, () => $('.Loader').mousedown(this.onDiagramUnfocus.bind(this)));
            },
            error: () => {window.alert('Error2');}
        });
    }

    onTest() {
        var id = this.state.engine.getDiagramModel().getID();
        $.ajax({
            url: '/publish/staging/'+id,
            type: 'POST',
            success: () => {window.alert('Success');},
            error: () => {window.alert('Error3');}
        });
    }

    onPublish() {
        var id = this.state.engine.getDiagramModel().getID();
        if (window.confirm('Are you ready to publish?')) {
            $.ajax({
                url: '/publish/production/'+id,
                type: 'POST',
                success: () => {window.alert('Success');},
                error: () => {window.alert('Error4');}
            });
        }
    }

    onLoadId(id) {
        console.log(id);
        $.ajax({
            url: '/diagrams/'+id,
            type: 'GET',
            success: diagram => {
                var engine = this.state.engine;
                var model = new SRD.DiagramModel();
                model.deSerializeDiagram(JSON.parse(diagram.data), engine);
                engine.setDiagramModel(model);
                var nodes = engine.getDiagramModel().getNodes();
                for (var key in nodes) {
                    if (nodes[key].extras.type === 'story') {
                        nodes[key].addListener({ entityRemoved: e => {e.stopPropagation();} });
                    }
                }
                this.setState({
                    engine: engine,
                    modal: false,
                    diagrams: [],
                    title: diagram.title
                });
            },
            error: () => {window.alert('Error5');}
        });
    }

    render() {
        return (
            <div className='App'>
                <NavBar name={this.props.name} history={this.props.history}/>
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
                    onUpdateTitle={(e) => {this.setState({title: e.target.value});}}
                    onSave={this.onSave.bind(this)} 
                    onLoad={this.onLoad.bind(this)} 
                    onTest={this.onTest.bind(this)} 
                    onPublish={this.onPublish.bind(this)}
                    diagrams={this.state.diagrams}
                    onLoadId={this.onLoadId.bind(this)}
                    onSelected={this.onLoad}
                    saving={this.state.saving}
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
                        var node = new SRD.DefaultNodeModel('New '+data.text, data.color);
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
                    <SRD.DiagramWidget diagramEngine={this.state.engine} allowLooseLinks={false} />
                </div>
                { this.state.selected ? <div className={'Editor' + (this.state.open ? ' open' : '') }>
                     <Editor node={this.state.selected} onUpdate={() => this.setState({})} onClose={e => this.setState({ open: false })} />
                </div> : null }
            </div>
        );
    }
}

export default StoryBoard;
