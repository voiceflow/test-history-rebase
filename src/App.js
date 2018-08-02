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
        engine.setDiagramModel(new SRD.DiagramModel());

        this.state = {
            engine: engine,
            selected: null,
            loading: false,
            diagrams: []
        };
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
                    { text: 'Story', type: 'story' },
                    { text: 'Choice', type: 'choice' },
                    { text: 'Line', type: 'line' },
                    { text: 'Listen', type: 'listen' },
                    { text: 'Retry', type: 'retry' },
                    { text: 'Ending', type: 'ending' },
                    { text: 'Comment', type: 'comment' }
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
                        var node = null;
                        if (data.type === 'story') {
                            node = new SRD.DefaultNodeModel('New Story', 'red');
                            node.addOutPort(' ').setMaximumLinks(1);
                            node.extras = {
                                title: '',
                                audio: '',
                                preview: '',
                                prompt: ''
                            };
                        } else if (data.type === 'choice') {
                            node = new SRD.DefaultNodeModel('New Choice', 'green');
                            node.addInPort(' ');
                            node.addOutPort('else');
                            node.extras = {
                                audio: '',
                                prompt: '',
                                choices: [],
                                inputs: []
                            };
                        } else if (data.type === 'line') {
                            node = new SRD.DefaultNodeModel('New Line', 'blue');
                            node.addInPort(' ');
                            node.addOutPort(' ').setMaximumLinks(1);
                            node.extras = {
                                audio: ''
                            };
                        } else if (data.type === 'listen') {
                            node = new SRD.DefaultNodeModel('New Listen', 'yellow');
                            node.addInPort(' ');
                            node.addOutPort(' ').setMaximumLinks(1);
                            node.extras = {
                                audio: '',
                                prompt: ''
                            };
                        } else if (data.type === 'retry') {
                            node = new SRD.DefaultNodeModel('New Retry', 'orange');
                            node.addInPort(' ');
                            node.addOutPort(' ').setMaximumLinks(1);
                            node.extras = {
                                audio: ''
                            };
                        } else if (data.type === 'ending') {
                            node = new SRD.DefaultNodeModel('New Ending', 'red');
                            node.addInPort(' ');
                            node.extras = {
                                audio: ''
                            };
                        } else if (data.type === 'comment') {
                            node = new SRD.DefaultNodeModel('New Comment', 'black');
                        } else {
                            return;
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
                    <SRD.DiagramWidget diagramEngine={this.state.engine} maxNumberPointsPerLink={0} allowLooseLinks={false} />
                </div>
                { this.state.selected ? <Editor node={this.state.selected} onUpdate={() => this.setState({})} onClose={e => this.setState({ selected: null })} /> : null }
                { this.state.loading ? <Loader diagrams={this.state.diagrams} onLoadId={this.onLoadId.bind(this)} onClose={e => this.setState({ loading: false })} /> : null }
            </div>
        );
    }
}

export default App;
