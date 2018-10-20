import React, {Component} from 'react';

class Diagram extends Component {
	render(){
    	<div
        className="diagram-layer"
        onDrop={event => {
            var engine = this.props.engine;
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
        <SRD.DiagramWidget diagramEngine={this.props.engine} allowLooseLinks={false}/>
    </div>
	}
}