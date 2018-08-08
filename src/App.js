import React, { Component } from 'react';
import $ from 'jquery';
import * as SRD from 'storm-react-diagrams';
import Menu from './Menu';
import Editor from './Editor';
import Loader from './Loader';
import './App.css';
import 'storm-react-diagrams/dist/style.min.css';

class App extends Component {
    constructor(props) {
        super(props);

        var engine = new SRD.DiagramEngine();
        engine.installDefaultFactories();

        var model = new SRD.DiagramModel();

        var node = new SRD.DefaultNodeModel('New Story', 'red');
        node.addOutPort(' ').setMaximumLinks(1);
        node.extras = {
            title: '',
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
        node.setLocked(true);
        node.extras.type = 'story';
        node.setPosition($(window).width()/3-32, $(window).height()/2-21);
        node.setSelected();
        model.addNode(node);
        engine.setDiagramModel(model);

        this.state = {
            engine: engine,
            selected: node,
            loading: false,
            diagrams: []
        };
        
        $('.Editor').mousedown(this.onDiagramUnfocus.bind(this));
    }

    componentDidMount() {
        $('.srd-node-layer').click(() => {
            var engine = this.state.engine;
            var node = engine.getDiagramModel().getNode($('.srd-node--selected').data('nodeid'));
            this.setState({
                engine: engine,
                selected: node
            }, () => $('.Editor').mousedown(this.onDiagramUnfocus.bind(this)));
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
                selected: null
            });
        }
    }

    onSave() {
        var data = this.state.engine.getDiagramModel().serializeDiagram();
        var diagram = {
            data: JSON.stringify(data),
            id: data.id
        }
        for (var i = 0; i < data.nodes.length; i++) {
            if (data.nodes[i].extras.type === 'story') {
                diagram.title = data.nodes[i].extras.title;
                break;
            }
        }
        $.ajax({
            url: '/diagrams',
            type: 'POST',
            data: diagram,
            success: () => {window.alert('Success');},
            error: () => {window.alert('Error');}
        });
    }

    onLoad() {
        $.ajax({
            url: '/diagrams',
            type: 'GET',
            success: data => {
                this.setState({
                    loading: true,
                    diagrams: data
                }, () => $('.Loader').mousedown(this.onDiagramUnfocus.bind(this)));
            },
            error: () => {window.alert('Error');}
        });
    }

    onTest() {
        var id = this.state.engine.getDiagramModel().getID();
        $.ajax({
            url: '/publish/staging/'+id,
            type: 'POST',
            success: () => {window.alert('Success');},
            error: () => {window.alert('Error');}
        });
    }

    onPublish() {
        var id = this.state.engine.getDiagramModel().getID();
        if (window.confirm('Are you ready to publish?')) {
            $.ajax({
                url: '/publish/production/'+id,
                type: 'POST',
                success: () => {window.alert('Success');},
                error: () => {window.alert('Error');}
            });
        }
    }

    onLoadId(id) {
        $.ajax({
            url: '/diagrams/'+id,
            type: 'GET',
            success: diagram => {
                var engine = this.state.engine;
                var model = new SRD.DiagramModel();
                model.deSerializeDiagram(JSON.parse(diagram.data), engine);
                engine.setDiagramModel(model);
                this.setState({
                    engine: engine,
                    loading: false,
                    diagrams: []
                });
            },
            error: () => {window.alert('Error');}
        });
    }

    render() {
        return (
            <div className='App'>
                <Menu onSave={this.onSave.bind(this)} onLoad={this.onLoad.bind(this)} onTest={this.onTest.bind(this)} onPublish={this.onPublish.bind(this)} items={[
                    { text: 'Choice', type: 'choice', color: 'green', menuColor: 'darkgreen' },
                    { text: 'Line', type: 'line', color: 'blue', menuColor: 'darkblue' },
                    { text: 'Listen', type: 'listen', color: 'yellow', menuColor: '#cccc00' },
                    { text: 'Retry', type: 'retry', color: 'orange', menuColor: 'darkorange' },
                    { text: 'Ending', type: 'ending', color: 'red', menuColor: 'darkred' },
                    { text: 'Comment', type: 'comment', color: 'black', menuColor: 'black' }
                ]} />
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
                            selected: node
                        }, () => $('.Editor').mousedown(this.onDiagramUnfocus.bind(this)));
                    }}
                    onDragOver={event => {
                        event.preventDefault();
                    }}
                >
                    <SRD.DiagramWidget diagramEngine={this.state.engine} allowLooseLinks={false} />
                </div>
                { this.state.selected ? <Editor node={this.state.selected} onUpdate={() => this.setState({})} onClose={e => this.setState({ selected: null })} /> : null }
                { this.state.loading ? <Loader diagrams={this.state.diagrams} onLoadId={this.onLoadId.bind(this)} onClose={e => this.setState({ loading: false })} /> : null }
            </div>
        );
    }
}

export default App;
