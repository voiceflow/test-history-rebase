import React, { Component } from 'react';
import axios from 'axios';
import Line from './Editors/Line';
import Choice from './Editors/Choice';
import Ending from './Editors/Ending';
import Retry from './Editors/Retry';
import Listen from './Editors/Listen';
import Story from './Editors/Story';
import Random from './Editors/Random';
import Variable from './Editors/Variable';
import SetBlock from './Editors/Set';
import IfBlock from './Editors/If';
import OldIfBlock from './Editors/OldIf';
import Speak from './Editors/Speak';
import OldSpeak from './Editors/OldSpeak';
import Capture from './Editors/Capture';
import Command from './Editors/Command';
import Diagram from './Editors/Diagram';
import API from './Editors/API';
import Module from './Editors/Module';
import Mail from './Editors/Mail'

class Editor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            node: this.props.node,
            voices: [],
            templates: []
        };

        this.BlockViewer = this.BlockViewer.bind(this);
        this.renderTitle = this.renderTitle.bind(this);
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

        axios.get('/email/templates')
        .then(res => {
            let templates = res.data.map(t => {
                let variables = [];
                if(t.variables){
                    try{
                        variables = JSON.parse(t.variables);
                    }catch(err){
                        console.error(err);
                    }
                }

                return {
                    title: t.title,
                    sender: t.sender,
                    template_id: t.template_id,
                    variables: variables
                }
            })
            this.setState({
                templates: templates
            })
        })
        .catch(err => {
            window.alert('Couldn\'t Retrieve Templates');
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
                return <Story/>;
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
                return <SetBlock node={this.state.node} variables={this.props.variables} onUpdate={this.props.onUpdate}/>
            case 'variable':
                return <Variable node={this.state.node} variables={this.props.variables} onUpdate={this.props.onUpdate}/>
            case 'if':
                if(this.state.node.extras.expressions){
                    return <IfBlock node={this.state.node} variables={this.props.variables} onUpdate={this.props.onUpdate} repaint={this.props.repaint}/>
                }else{
                    return <OldIfBlock node={this.state.node} variables={this.props.variables} onUpdate={this.props.onUpdate} repaint={this.props.repaint}/>
                }
            case 'listen':
                return <Listen node={this.state.node} voices={this.state.voices} onUpdate={this.props.onUpdate}/>
            case 'random':
                return <Random node={this.state.node} onUpdate={this.props.onUpdate} repaint={this.props.repaint} />
            case 'retry':
                return <Retry node={this.state.node} voices={this.state.voices} onUpdate={this.props.onUpdate}/>
            case 'ending':
                return <Ending node={this.state.node} voices={this.state.voices} onUpdate={this.props.onUpdate}/>
            case 'speak':
                if(this.state.node.extras.rawContent === undefined){
                    return <OldSpeak node={this.state.node} onUpdate={this.props.onUpdate} variables={this.props.variables}/>
                } else {
                    return <Speak node={this.state.node} onUpdate={this.props.onUpdate} variables={this.props.variables}/>
                }
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
            case 'api':
                return <API node={this.state.node} onUpdate={this.props.onUpdate} variables={this.props.variables}/>
            case 'module':
                return <Module node={this.state.node} onUpdate={this.props.onUpdate} variables={this.props.variables} user_modules={this.props.user_modules}/>
            case 'mail':
                return <Mail node={this.state.node} onUpdate={this.props.onUpdate} variables={this.props.variables} templates={this.state.templates}/>
            default:
              return null;
        }
    }

    renderTitle(){
        switch(this.state.node.extras.type) {
            case 'story':
                return (<div id="label">Start Block</div>)
            case 'module':
                return (<div id="label">{this.state.node.name}</div>)
            case 'flow':
                return (<div id="label">
                    {this.state.node.extras.diagram_id ? 
                    (()=>{ 
                        let block = this.props.diagrams.find(d => d.id === this.state.node.extras.diagram_id); 
                        return (block ? block.name : 'New Flow') 
                    })() : 
                    "Add Flow"}
                </div>);
            default:
              return (<input id="label" placeholder="Block Label" 
                    type="text"
                    name="name"
                    value={this.state.node.name}
                    onChange={this.handleChange.bind(this)}
                />);
        }
    }

    render() {

        const type = this.state.node ? this.state.node.extras.type : null;

        return (
            <div id="Editor" className={(this.props.open && type ? 'open':'')}>
                {type ?
                    <form onSubmit={(e) => e.preventDefault()} className="controls" key={this.state.node.id}>
                        <div className="top">
                            <div className="property">
                                <div id="close-editor" className="close" onClick={this.props.close}>&times;</div>
                                <div className="d-flex">
                                    <div className={"block " + type} onClick={() => this.props.setHelp({type: this.state.node.extras.type})}>
                                        {type} block <i className="fas fa-question-circle mr-1"/>
                                    </div>
                                    <div className="delete-block" onClick={this.props.removeNode}>
                                        <i className="fas fa-trash"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="editor-section">
                            {this.renderTitle()}
                            {this.BlockViewer()}
                        </div>
                    </form> 
                : null}
            </div>
        );
    }
}

export default Editor;
