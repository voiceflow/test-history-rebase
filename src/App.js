import React, { Component } from 'react';
import $ from 'jquery';
import * as SRD from 'storm-react-diagrams';
import Menu from './Menu';
import Editor from './Editor';
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
            selected: null
        };
    }

    componentDidMount() {
        $('.srd-node-layer').dblclick(() => {
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
        if (this.state.selected && e.entity.id === this.state.selected.id) {
            this.setState({
                selected: null
            });
        }
    }

    render() {
        return (
            <div className='App'>
                <Menu items={[
                    { text: 'New Story', type: 'story' },
                    { text: 'New Line', type: 'line' }
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
                            node.addOutPort('Intro');
                        } else if (data.type === 'line') {
                            node = new SRD.DefaultNodeModel('New Line', 'blue');
                            node.addInPort('Previous');
                            node.sfChoices = [];
                        } else {
                            return;
                        }
                        node.sfType = data.type;
                        node.addListener({ entityRemoved: this.onNodeRemoved.bind(this) });
                        var points = engine.getRelativeMousePoint(event);
                        node.x = points.x;
                        node.y = points.y;
                        engine.getDiagramModel().addNode(node);
                        this.setState({});
                    }}
                    onDragOver={event => {
                        event.preventDefault();
                    }}
                >
                    <SRD.DiagramWidget diagramEngine={this.state.engine} maxNumberPointsPerLink={0} />
                </div>
                { this.state.selected ? <Editor node={this.state.selected} onFocus={this.onDiagramUnfocus.bind(this)} onUpdate={() => this.setState({})} onClose={(e) => this.setState({ selected: null })} /> : null }
            </div>
        );
    }
}

export default App;
