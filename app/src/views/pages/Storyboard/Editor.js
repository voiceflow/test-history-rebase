import React, { Component } from 'react';
import axios from 'axios';
import Line from './Editors/Line';
import Choice from './Editors/Choice';
import Ending from './Editors/Ending';
import Retry from './Editors/Retry';
import Listen from './Editors/Listen';
import Story from './Editors/Story';
import Random from './Editors/Random';
import SetBlock from './Editors/Set';
import IfBlock from './Editors/If';
import Speak from './Editors/Speak';
import Capture from './Editors/Capture';
import Command from './Editors/Command';
import Diagram from './Editors/Diagram';

class Editor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            node: this.props.node,
            voices: []
        };

        this.BlockViewer = this.BlockViewer.bind(this)
    }

    componentDidMount() {
        // $('*').keypress(function(e) {
        //     if ((e.keyCode === 13 || e.which === 13) && e.target.name !== 'inputs' && !e.target.name.endsWith('Text')) {
        //         e.preventDefault();
        //     }
        // });

        axios.get('/voices')
        .then(res => {
            this.setState({
                voices: res.data
            });
        })
        .catch(err => {
            console.error(err.response);
            window.alert('Couldn\'t Retrieve Voices');
        })

    }

    componentWillReceiveProps(props) {
        this.setState({
            node: props.node
        });
    }

    handleChange(e, key = undefined) {
        var node = this.state.node;
        var name = e.target.getAttribute('name');
        var value = e.target.value;
        if (name === 'name') {
            node[name] = value;
        } else if (key !== undefined && typeof key === 'string') {
            node.extras[name][key] = value;
        } else {
            node.extras[name] = value;
        }
        this.setState({
            node: node
        }, () => {
            this.props.onUpdate();
            if(name === 'name'){
                this.props.repaint();
            }
        });
    }

    BlockViewer() {
        switch(this.state.node.extras.type) {
            case 'story':
                return <Story node={this.state.node} voices={this.state.voices} onUpdate={this.props.onUpdate}/>;
            case 'choice':
            case 'choicenew':
                return <Choice
                        node={this.state.node} 
                        voices={this.state.voices} 
                        onUpdate={this.props.onUpdate}
                        repaint={this.props.repaint}
                    />
            case 'line':
            case 'audio': 
            case 'multiline':
                return <Line node={this.state.node} voices={this.state.voices} onUpdate={this.props.onUpdate}/>
            case 'set':
            case 'variable':
                return <SetBlock node={this.state.node} variables={this.props.variables} onVariable={this.props.onVariable} onUpdate={this.props.onUpdate}/>
            case 'if':
                return <IfBlock node={this.state.node} variables={this.props.variables} onUpdate={this.props.onUpdate}/>
            case 'listen':
                return <Listen node={this.state.node} voices={this.state.voices} onUpdate={this.props.onUpdate}/>
            case 'random':
                return <Random node={this.state.node} onUpdate={this.props.onUpdate} repaint={this.props.repaint} />
            case 'retry':
                return <Retry node={this.state.node} voices={this.state.voices} onUpdate={this.props.onUpdate}/>
            case 'ending':
                return <Ending node={this.state.node} voices={this.state.voices} onUpdate={this.props.onUpdate}/>
            case 'speak':
                return <Speak node={this.state.node} onUpdate={this.props.onUpdate} variables={this.props.variables}/>
            case 'capture':
                return <Capture node={this.state.node} onUpdate={this.props.onUpdate} variables={this.props.variables}/>
            case 'command':
                return <Command node={this.state.node} onUpdate={this.props.onUpdate}/>
            case 'flow':
                return <Diagram node={this.state.node} 
                    onUpdate={this.props.onUpdate} 
                    variables={this.props.variables} 
                    createDiagram={this.props.createDiagram}
                    diagrams={this.props.diagrams}
                    enterFlow={this.props.enterFlow}
                />
            default:
              return null;
        }
    }

    render() {

        const type = this.state.node ? this.state.node.extras.type : null;

        return (
            <div id="Editor" className={(this.props.open && type ? 'open':'')}>
                {type ?
                    <form onSubmit={(e) => e.preventDefault()} className="controls">
                        <div className="top">
                            <div className="property">
                                <div id="close-editor" className="close" onClick={this.props.close}>&times;</div>
                                <div className={"block " + type} onClick={() => this.props.setHelp({type: this.state.node.extras.type})}>
                                    {type} block <i className="fas fa-question-circle mr-1"/>
                                </div>
                            </div>
                        </div>
                        <div id="editor-section">
                            {this.state.node.extras.type === 'flow' ? 
                                <div id="label">
                                    {this.state.node.extras.diagram_id ? 
                                    (()=>{ 
                                        let block = this.props.diagrams.find(d => d.id === this.state.node.extras.diagram_id); 
                                        return (block ? block.name : 'New Flow') 
                                    })() : 
                                    "Add Flow"}
                                </div>
                                : 
                                <input id="label" placeholder="Block Label" 
                                    type="text"
                                    name="name"
                                    value={this.state.node.name}
                                    onChange={this.handleChange.bind(this)}
                                />
                            }
                            {this.BlockViewer()}
                        </div>
                    </form> 
                : null}
            </div>
        );
    }
}

export default Editor;
