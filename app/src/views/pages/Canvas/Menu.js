import React, { PureComponent } from 'react';
import MenuItem from './MenuItem';
import TemplateItem from './TemplateItem';
import ModuleItem from './ModuleItem';
import { InputGroup, Input, InputGroupAddon, Button, FormGroup, Label, ButtonGroup, Collapse } from 'reactstrap';
import isVarName from 'is-var-name';
import FlowButton from './FlowButton';
import {Tooltip} from 'react-tippy';

const defaultVariables = {
    'sessions': 'The Number of times a particular user has opened the app',
    'user_id': 'The user\'s Amazon/Google unique id',
    'timestamp': 'UNIX timestamp (number of seconds since January 1st, 1970 at UTC.)'
}

const sections = [{
    title: 'Basic',
    items: [
        { text: 'Speak', type: 'speak', icon: <i className="fas fa-megaphone"/>, tip: 'Tell Alexa to talk to the user' },
        { text: 'Audio', type: 'audio', icon: <i className="fas fa-volume-up"/>, tip: 'Add sound effects & audio clips under 240 seconds' },
        { text: 'Stream', type: 'stream', icon: <i className="fas fa-music"/>, tip: 'Stream long audio files & URLs for the user'  },
        { text: 'Choice', type: 'choice', icon: <i className="fas fa-project-diagram"/>, tip: 'Listen for the user to make a choice from a list of options you set'  },
        { text: 'Command', type: 'command', icon: '⌘', tip: 'Add shortcuts for your users to navigate your skill quickly'},
        { text: 'Comment', type: 'comment', icon: <i className="fas fa-sticky-note"/>, tip: 'Add notes to your diagram'}
    ]
},{
    title: 'Advanced',
    items: [
        { text: 'Random', type: 'random', icon: <i className="fas fa-random"/>, tip: 'Choose randomly from a set number of paths' },
        { text: 'Set', type: 'set', icon: <i className="fas fa-code"/>, tip: 'Set the value of a variable, or many variables at once'  },
        { text: 'If', type: 'if', icon: <i className="fas fa-code-branch"/>, tip: 'Set conditions that activate paths only when true' },
        { text: 'Capture', type: 'capture', icon: <i className="fas fa-microphone"/>, tip: 'Capture what the user says into a variable'  },
        { text: 'Flow', type: 'flow', icon: <i className="fas fa-clone"/>, tip: 'Organize your project into manageable sections or perform computations'},
        { text: 'API', type: 'api', icon: <i className="fas fa-globe"/>, tip: 'Use external APIs and store responses into variables'  },
        // { text: 'Mail', type: 'mail', icon: <i className="far fa-envelope"/> },
        { text: 'Permissions', type: 'permissions', icon: <i className="fas fa-lock"/>, tip: 'Ask users for access to their info (Name, Email, Phone)'  },
   ]
}];

const tabs = {
    top: [
        {tab: "blocks", icon: <i className="fas fa-plus-square"/>, tip: 'Blocks'},
        {tab: "project", icon: <i className="fas fa-folder"/>, tip: 'Project'},
        {tab: "variables", icon: <i className="fas fa-code"/>, tip: 'Variables'}
    ],
    bottom: [
        {link: "https://university.getvoiceflow.com/", icon: <i className="fas fa-graduation-cap"/>, tip: 'Access tutorials & help through Voiceflow University'},
        {link: "https://www.facebook.com/groups/199476704186240/", icon: <i className="fab fa-facebook-f"/>, tip: 'Join the Voiceflow Community for help & updates'}
    ]
}
class Menu extends PureComponent {
    constructor(props) {
        super(props);

        // Store state of basic + advanced tabs
        let show = localStorage.getItem('show')
        if(!show){
            show = {
                Basic: true,
                Advanced: false
            }
        } else {
            show = JSON.parse(show)
        }

        this.state = {
            open: true,
            tab: 'blocks',
            new_var: '',
            new_global: '',
            tree: null,
            block_tab_state: 'blocks',
            show: show
        }

        this.openTab = this.openTab.bind(this);
        this.addVariable = this.addVariable.bind(this);
        this.addGlobalVariable = this.addGlobalVariable.bind(this);
        this.deleteVariable = this.deleteVariable.bind(this);
        this.deleteGlobalVariable = this.deleteGlobalVariable.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.buildTree = this.buildTree.bind(this);
        this.updateTree = this.updateTree.bind(this);
        this.toggleBlockSection = this.toggleBlockSection.bind(this);
        this.visited = new Set();
    }

    componentDidMount() {
        this.props.build(this.updateTree);
    }

    buildTree(node, depth=0){

        // Array.isArray(sub_diagrams) && sub_diagrams.length > 0
        this.visited.add(node.id);

        if(depth < 4) {
            return (<React.Fragment>

                <FlowButton flow={node} active={this.props.current} enterFlow={this.props.enterFlow} updateTree={this.updateTree} onFlowRenamed={this.props.onFlowRenamed} />

                {(() => {
                    let sub_diagrams;
                    if(node.sub_diagrams){
                        sub_diagrams = node.sub_diagrams;
                    }

                    if(Array.isArray(sub_diagrams) && sub_diagrams.length !== 0){
                        
                        return sub_diagrams.map((diagram_id, i) => {
                            let block = this.props.diagrams.find(d => d.id === diagram_id);

                            if(block){
                                return <div className="sub-diagram" key={i}>
                                    <div className="sub-column">
                                        {this.buildTree(block, depth+1)}
                                    </div>
                                </div>;
                            }else{
                                return null;
                            }
                        })
                    }
                })()}
            </React.Fragment>)

        } else {
            return <div className='diagram-block'>...</div>;
        }
    }

    toggleBlockSection(section_title){
        let s = this.state
        s.show[section_title] = !s.show[section_title]
        localStorage.setItem('show', JSON.stringify(s.show))
        this.setState(s)
        this.forceUpdate()
    }

    updateTree() {
        for(let diagram of this.props.diagrams){
            if(diagram.name === 'ROOT'){
                this.visited = new Set();
                this.setState({
                    tree: this.buildTree(diagram)
                });
            }
        }
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    openTab(tab) {
        if(tab !== this.state.tab || !this.state.open){
            this.setState({
                open: true,
                tab: tab
            });
        }
    }

    addVariable (e){
        if(e) e.preventDefault();
        let variables = this.props.variables;
        let new_var = this.state.new_var;
        if(isVarName(new_var) && !variables.includes(new_var) && !this.props.global_variables.includes(new_var)){
            variables.push(new_var);
            this.props.onVariable(variables);
            this.setState({
                new_var: ""
            })
        }else{
            alert('Invalid Variable: Variables must start with a character and can not contain spaces or special characters');
        }
        return false
    }

    addGlobalVariable (e){
        if(e) e.preventDefault();
        let variables = this.props.global_variables;
        let new_var = this.state.new_global;
        if(isVarName(new_var) && !variables.includes(new_var) && !this.props.variables.includes(new_var)){
            variables.push(new_var);
            this.props.onGlobalVariable(variables);
            this.setState({
                new_global: ""
            })
        }else{
            alert('Invalid Variable: Variables can\'t have the same name and must start with a character and can not contain spaces or special characters');
        }
        return false
    }

    deleteVariable(variable){
        let variables = this.props.variables
        let index = variables.indexOf(variable)
        if (index !== -1) variables.splice(index, 1)
        this.props.onVariable(variables)
    }

    deleteGlobalVariable(variable){
        let variables = this.props.global_variables
        let index = variables.indexOf(variable)
        if (index !== -1) variables.splice(index, 1)
        this.props.onGlobalVariable(variables)
    }

    render() {

        let content;
        if(this.state.tab === 'blocks'){
            if(this.state.block_tab_state === 'blocks'){
                content =
                    sections.map((section, i) => {
                        return <div key={i} className="section no-select">
                            <span 
                                className="section-title" 
                                onClick={() => {this.toggleBlockSection(section.title)}}>
                                    {this.state.show[section.title]? 
                                        <i className="fas fa-caret-down"></i>: 
                                        <i className="fas fa-caret-right"></i>
                                    }
                                    {section.title}
                            </span>
                            <Collapse isOpen={this.state.show[section.title]}>
                                {section.items.map((item, i) => {
                                    return <MenuItem item={item} key={i} data-tip={item.tip}/>
                                })}
                            </Collapse>
                        </div>
                })
            } else {
                if(this.props.user_modules.length > 0){
                    content = 
                    <div>
                    {this.props.user_modules.map((user_module, i) => {
                        return <ModuleItem module={user_module} key={i} />;
                    })}
                    </div>
                }else{
                    content = <div className="mt-2">You have no flows <span role="img" aria-label="crying emoji">😭</span> visit <Button color="link" className="pl-0 pr-0 pt-0 pb-0" onClick={() => {this.props.history.push('/market')}}>Marketplace</Button> to get some!</div>
                }
            }
        }else if(this.state.tab === 'project'){
            // content = this.props.diagrams.map((diagram, i) => 
            //     <div className="diagram-block" key={i} onClick={()=>this.props.enterFlow(diagram.id)}>
            //         {diagram.name}
            //     </div>
            // );

            //<label>Templates</label>
            // {this.props.user_templates.length > 0?
            //     <div>
            //     {this.props.user_templates.map((user_template, i) => {
            //         return <TemplateItem onTemplateChoice={this.props.onTemplateChoice} module={user_template} key={i} />;
            //     })}
            //     </div>
            //     :
            //     <div>You have no templates <span role="img" aria-label="crying emoji">😭</span> visit <Button color="link" className="pl-0 pr-0 pt-0 pb-0" onClick={() => {this.props.history.push('/market')}}>Marketplace</Button> to get some!</div>
            // }

            let unused = [];

            for(let diagram of this.props.diagrams){
                if(!this.visited.has(diagram.id)){
                    let block = this.props.diagrams.find(d => d.id === diagram.id);
                    if (block) { 
                        unused.push(
                            <FlowButton
                                key={block.id}
                                flow={block} 
                                active={this.props.current} 
                                enterFlow={this.props.enterFlow}
                            />);
                    }
                }
            }

            content = <React.Fragment>
                <label>Project Flows</label>
                {this.state.tree}
                {unused.length === 0 ? null : <React.Fragment>
                    <hr className='mb-2 mt-4'/>
                    <label>Other Flows</label>
                    {unused.map((diagram, i) => {
                        return diagram;
                    })}
                    <hr className='mb-2 mt-4'/>                
                </React.Fragment>}
            </React.Fragment>;
        }else if(this.state.tab === 'variables'){
            content = <React.Fragment>
            <form onSubmit={this.addGlobalVariable}>
                    <FormGroup className="mb-0">
                        <Label>Add New Global Variable</Label>
                        <InputGroup>
                            <Input name="new_global" value={this.state.new_global} onChange={this.handleChange} maxLength="16"/>
                            <InputGroupAddon addonType="append"><Button type="submit" className="new_var"><i className="fas fa-plus"/></Button></InputGroupAddon>
                        </InputGroup>
                    </FormGroup>
                </form>
                <h1 className="down-arrow"><i className="fas fa-arrow-down"></i></h1>
                <div>
                    <Label>Global Variables</Label>
                    <div className="variables">
                        {this.props.global_variables.map((variable, i) => {
                            if(variable in defaultVariables){
                                return <Tooltip key={variable} position="bottom" title={defaultVariables[variable]}>
                                    <div className="variable_tag global default">{'{' + variable + '}'}</div>
                                </Tooltip>
                            }else{
                                return <div key={variable} className="variable_tag global">{'{' + variable + '}'} <span onClick={() => this.deleteGlobalVariable(variable)}><i className="fas fa-times"></i></span></div>
                            }
                        })}
                    </div>
                </div>
                <hr/>
                <form onSubmit={this.addVariable}>
                    <FormGroup className="mb-0">
                        <Label>Add New Variable</Label>
                        <InputGroup>
                            <Input name="new_var" value={this.state.new_var} onChange={this.handleChange} maxLength="16"/>
                            <InputGroupAddon addonType="append"><Button type="submit" className="new_var"><i className="fas fa-plus"/></Button></InputGroupAddon>
                        </InputGroup>
                    </FormGroup>
                </form>
                <h1 className="down-arrow"><i className="fas fa-arrow-down"></i></h1>
                <div>
                    <Label>Variables</Label>
                    <div className="variables">
                        {this.props.variables.length > 0 ? this.props.variables.map(function(variable, i){
                            return <div key={variable} className="variable_tag">
                                {'{' + variable + '}'} <span onClick={() => this.deleteVariable(variable)}><i className="fas fa-times"></i></span>
                            </div>
                        }.bind(this)) : <span className="text-muted">No Existing Variables</span>}
                    </div>
                </div>
            </React.Fragment>
        } 

        let block_module_group;
        // if(this.state.tab === 'blocks'){
        //     block_module_group = 
        //         <ButtonGroup>
        //             <Button outline={this.state.block_tab_state !== 'blocks'} onClick={() => {this.setState({block_tab_state: 'blocks'})}} disabled={this.state.block_tab_state === 'blocks'}> Blocks </Button>
        //             <Button outline={this.state.block_tab_state !== 'modules'} onClick={() => {this.setState({block_tab_state: 'modules'})}} disabled={this.state.block_tab_state === 'modules'}>Modules</Button>
        //         </ButtonGroup>
        // } else {
        //     block_module_group = null;
        // }

        return (
            <div className="Menu">
                <div className='toolbar'>
                    <div className="top-down">
                        {tabs.top.map((tab, i) => {
                            return (
                                <Tooltip key={i} title={tab.tip} position='right' disabled={true && tab.tab === this.state.tab && this.state.open}>
                                    <div className={"tool" + ((tab.tab === this.state.tab && this.state.open) ? ' active' : '')} 
                                        onClick={() => this.openTab(tab.tab)}>
                                        {tab.icon}
                                    </div>
                                </Tooltip>
                            )
                        })}
                    </div>
                    <div className="spacer"/>
                    <div className="bottom-up">
                        {tabs.bottom.map((tab, i) => {
                            return (
                                <Tooltip key={i} title={tab.tip} position='right'>
                                    <a className="tool no-underline" href={tab.link} target="_blank" rel="noopener noreferrer">
                                        {tab.icon}
                                    </a>
                                </Tooltip>
                            )
                        })}
                    </div>
                </div>
                <div id="sidebar" className={this.state.open ? 'open' : ''}>
                    <div>
                        <div className='block-title no-select' onClick={() => this.setState({open: false})}>
                            <h5 className="mb-0">{this.state.tab}</h5>
                            <div className="close pr-1 pl-3 py-3">×</div>
                        </div>
                    </div>
                    <div className="sidebar-content">
                        {block_module_group}
                        {content}
                    </div>
                </div>
            </div>
        );
        // <a className="tool no-underline" href="/market" rel="noopener noreferrer">
            // <i className="fas fa-store-alt"/>
        // </a>
    }
}

export default Menu;
