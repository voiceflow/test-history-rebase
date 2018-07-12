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
            engine.getDiagramModel().clearSelection();
            this.setState({
                engine: engine,
                selected: node
            });
        });

        $('.Menu').click(this.onDiagramUnfocus.bind(this));
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

    onLoad() {
        $.ajax({
            url: 'https://api.getstoryflow.com/diagrams',
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                this.setState({
                    loading: true,
                    diagrams: data
                });
            }
        });
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
            url: 'https://api.getstoryflow.com/diagrams',
            type: 'POST',
            dataType: 'json',
            data: diagram
        });
    }

    onLoadId(id) {
        $.ajax({
            url: 'https://api.getstoryflow.com/diagrams/'+id,
            type: 'GET',
            dataType: 'json',
            success: (diagram) => {
                var engine = this.state.engine;
                var model = new SRD.DiagramModel();
                model.deSerializeDiagram(JSON.parse(diagram.data), engine);
                engine.setDiagramModel(model);
                this.setState({
                    engine: engine,
                    loading: false,
                    diagrams: []
                });
            }
        });
    }

    render() {
        return (
            <div className='App'>
                <Menu onSave={this.onSave.bind(this)} onLoad={this.onLoad.bind(this)} items={[
                    { text: 'Story', type: 'story' },
                    { text: 'Line', type: 'line' },
                    { text: 'Chapter', type: 'chapter' },
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
                                prompt: '',
                                ending: ''
                            };
                        } else if (data.type === 'line') {
                            node = new SRD.DefaultNodeModel('New Line', 'blue');
                            node.addInPort(' ');
                            node.extras = {
                                audio: '',
                                prompt: '',
                                choices: [],
                                inputs: []
                            };
                        } else if (data.type === 'chapter') {
                            node = new SRD.DefaultNodeModel('New Chapter', 'green');
                            node.addInPort(' ');
                            node.addOutPort(' ').setMaximumLinks(1);
                            node.extras = {
                                audio: '',
                                prompt: '',
                                number: ''
                            };
                        } else if (data.type === 'ending') {
                            node = new SRD.DefaultNodeModel('New Ending', 'orange');
                            node.addInPort(' ');
                            node.extras = {
                                audio: '',
                                prompt: ''
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
                        engine.getDiagramModel().addNode(node);
                        this.setState({
                            engine: engine
                        });
                    }}
                    onDragOver={event => {
                        event.preventDefault();
                    }}
                >
                    <SRD.DiagramWidget diagramEngine={this.state.engine} maxNumberPointsPerLink={0} allowLooseLinks={false} />
                </div>
                { this.state.selected ? <Editor node={this.state.selected} onFocus={this.onDiagramUnfocus.bind(this)} onUpdate={() => this.setState({})} onClose={(e) => this.setState({ selected: null })} /> : null }
                { this.state.loading ? <Loader diagrams={this.state.diagrams} onLoadId={this.onLoadId.bind(this)} onFocus={this.onDiagramUnfocus.bind(this)} onClose={(e) => this.setState({ loading: false })} /> : null }
            </div>
        );
    }
}

export default App;
