import React, { Component } from 'react';
import axios from 'axios';
import Line from './Editors/Line';
import Choice from './Editors/Choice';
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
import Mail from './Editors/Mail';
import Stream from './Editors/Stream';
import Permissions from './Editors/Permissions';
import {
    Modal, ModalBody, ModalHeader,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';

class Editor extends Component {
    constructor(props) {
        super(props)

        this.state = {
            node: this.props.node,
            voices: [],
            templates: [],
            permission_options: [],
            dropdownOpen: false,
            modal: false,
            expanded: false
        }

        this.BlockViewer = this.BlockViewer.bind(this)
        this.renderTitle = this.renderTitle.bind(this)
        // this.copyFlow = this.copyFlow.bind(this)
    }

    componentDidMount() {
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

        // Hard-code for now, but eventually should retrieve from
        // AMZN website if possible

        this.setState({
            permission_options: [
                { name: 'User Email', value: 'alexa::profile:email:read' },
                { name: 'User Name', value: 'alexa::profile:name:read' },
                { name: 'User Phone Number', value: 'alexa::profile:mobile_number:read' },
                // { name: 'Amazon Pay', value: 'payments:autopay_consent' }
                // Removed for now, amazon pay permissions broken
            ]
        })
    }

    componentWillReceiveProps(props) {
        this.setState({
            node: props.node
        });
    }

    handleChange(e, key = undefined) {
        var node = this.state.node
        var name = e.target.getAttribute('name')
        var value = e.target.value
        node[name] = value
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
        let variables = this.props.global_variables.concat(this.props.variables);

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
            case 'combine':
            case 'line':
            case 'audio': 
            case 'multiline':
                // DEPRECATE OLD LINE BLOCKS
                if(this.state.node.extras.type !== 'combine'){
                    let node = this.state.node
                    node.extras.type = 'combine'
                    this.setState({node: node})
                }
                return <Line node={this.state.node} voices={this.state.voices} onUpdate={this.props.onUpdate}/>
            case 'set':
                return <SetBlock node={this.state.node} variables={variables} onUpdate={this.props.onUpdate}/>
            case 'variable':
                return <Variable node={this.state.node} variables={variables} onUpdate={this.props.onUpdate}/>
            case 'if':
                // DEPRECATE OLD IF BLOCK
                if(this.state.node.extras.expressions){
                    return <IfBlock node={this.state.node} variables={variables} onUpdate={this.props.onUpdate} repaint={this.props.repaint}/>
                }else{
                    return <OldIfBlock node={this.state.node} variables={variables} onUpdate={this.props.onUpdate} repaint={this.props.repaint}/>
                }
            case 'random':
                return <Random node={this.state.node} onUpdate={this.props.onUpdate} repaint={this.props.repaint}/>
            case 'speak':
                // DEPRECATE OLD SPEAK BLOCKS
                if(this.state.node.extras.raw !== undefined){
                    return <OldSpeak node={this.state.node} onUpdate={this.props.onUpdate} variables={variables}/>
                } else {
                    return <Speak node={this.state.node} onUpdate={this.props.onUpdate} variables={variables}/>
                }
            case 'capture':
                return <Capture node={this.state.node} onUpdate={this.props.onUpdate} variables={variables}/>
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
                return <API node={this.state.node} onUpdate={this.props.onUpdate} variables={variables}/>
            case 'module':
                return <Module node={this.state.node} onUpdate={this.props.onUpdate} variables={variables} user_modules={this.props.user_modules}/>
            case 'mail':
                return <Mail node={this.state.node} onUpdate={this.props.onUpdate} variables={variables} templates={this.state.templates}/>
            case 'stream':
                return <Stream node={this.state.node} onUpdate={this.props.onUpdate} repaint={this.props.repaint}/>
            case 'permissions':
                return <Permissions node={this.state.node} onUpdate={this.props.onUpdate} variables={variables} permission_options={this.state.permission_options}/>
            default:
              return null
        }
    }

    renderTitle(){
        switch(this.state.node.extras.type) {
            case 'story':
                return (<div id="label">Start Block</div>)
            case 'module':
                return (<div id="label">{this.state.node.name}</div>)
            case 'flow':
                if(this.state.node.extras.diagram_id){
                    let block = this.props.diagrams.find(d => d.id === this.state.node.extras.diagram_id)
                    if(block && block.name !== this.state.node.name){
                        let node = this.state.node
                        node.name = block.name
                    }
                    return <div id="label">
                        {block ? block.name : 'New Flow'}
                    </div>
                }
                return <div id="label">Add Flow</div>
            default:
              return (<input id="label" placeholder="Block Label" 
                    type="text"
                    name="name"
                    value={this.state.node.name}
                    onChange={this.handleChange.bind(this)}
                />);
        }
    }

    // copyFlow(){
    //     if(this.state.node.extras.diagram_id){
    //         console.log("Copy this flow")
    //         console.log(this.state.node)
    //         axios.get(`/diagram/copy/${this.state.node.extras.diagram_id}`)
    //         .then(res => {
    //             console.log(res.data)
    //         })
    //         .catch(err => {
    //             console.log(err)
    //             window.alert('Error copying flow')
    //         })
    //     }
    // }

    render() {

        const type = this.state.node ? this.state.node.extras.type : null;
        // <Tooltip
        //     position="bottom"
        //     interactive={true}
        //     offset={-30}
        //     arrow
        //     hideOnClick={false}
        //     html={<React.Fragment>
        //         Delete Block
        //         <br/>
        //         <Button color="danger" size="sm" className="py-0 mt-1" onClick={this.props.removeNode}>Confirm</Button>
        //     </React.Fragment>}
        // >
        let Editor 
        if(type){
            Editor = this.BlockViewer()
        }

        return (
            <div id="Editor" className={(this.props.open && type && !this.state.modal ? 'open':'')} onClick={this.props.onClick}>
                {type ?
                    <div className="controls" key={this.state.node.id}>
                        <div className="top">
                            <div className="property">
                                <div id="close-editor" className="close" onClick={this.props.close}>&times;</div>
                                <div className="d-flex">
                                    <div className={"block " + type} onClick={() => this.props.setHelp({type: this.state.node.extras.type})}>
                                        {type} block <i className="fas fa-question-circle mr-1"/>
                                    </div>
                                    <div className="d-flex pl-2">
                                        <div 
                                            className="delete-block"
                                            onClick={()=>this.setState({
                                                expanded: true,
                                                modal: true
                                            })}
                                        >
                                            <i className="far fa-expand-arrows-alt"/>
                                        </div>
                                        <UncontrolledDropdown nav inNavbar>
                                            <DropdownToggle className="delete-block" nav tag="div">
                                                <i className="fas fa-cog"/>
                                            </DropdownToggle>
                                            <DropdownMenu right className="arrow arrow-right no-select" style={{right: '-3px', marginTop: '5px'}}>
                                                <DropdownItem header>
                                                    Block Options
                                                </DropdownItem>
                                                {/*this.state.node.extras.type === 'flow' && 
                                                    <DropdownItem onClick={this.copyFlow}>Copy Flow</DropdownItem>*/
                                                }
                                                <DropdownItem onClick={this.props.copyNode} className="pointer">
                                                    <i className="fas fa-copy text-muted"/> Copy
                                                </DropdownItem>
                                                <DropdownItem onClick={this.props.removeNode} className="pointer">
                                                    <i className="fas fa-file-times text-muted"/> Delete
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="editor-section">
                            {this.renderTitle()}
                            {Editor}
                            {this.state.expanded &&
                                <React.Fragment>
                                    <Modal 
                                        isOpen={this.state.modal} 
                                        toggle={()=>this.setState({modal: false})}
                                        onClosed={()=>this.setState({expanded: false})}
                                        size="lg"
                                    >
                                        <ModalHeader toggle={()=>this.setState({modal: false})}>{this.state.node.name} Settings</ModalHeader>
                                        <ModalBody className="pb-4 px-4">
                                            {Editor}
                                        </ModalBody>
                                    </Modal>
                                </React.Fragment>
                            }
                        </div>
                    </div> 
                : null}
            </div>
        );
    }
}

export default Editor;
