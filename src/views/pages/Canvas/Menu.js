import React, { PureComponent } from 'react';
import MenuItem from './MenuItem';
import TemplateItem from './TemplateItem';
import ModuleItem from './ModuleItem';
import { InputGroup, Input, InputGroupAddon, Button, FormGroup, Label } from 'reactstrap';
import isVarName from 'is-var-name';
import FlowButton from './FlowButton';

const defaultVariables = {
    'sessions': 'The Number of times a particular user has opened the app',
    'user_id': 'The user\'s Amazon/Google unique id',
    'timestamp': 'UNIX timestamp (number of seconds since January 1st, 1970 at UTC.)'
}

const sections = [{
    title: 'Basic',
    items: [
        { text: 'Speak', type: 'speak', icon: <i className="fas fa-megaphone"/> },
        { text: 'Audio', type: 'audio', icon: <i className="fas fa-volume-up"/> },
        { text: 'Stream', type: 'stream', icon: <i className="fas fa-music"/> },
        { text: 'Choice', type: 'choice', icon: <i className="fas fa-project-diagram"/> },
        { text: 'Command', type: 'command', icon: '⌘' },
        { text: 'Comment', type: 'comment', icon: <i className="fas fa-sticky-note"/> }
    ]
},{
    title: 'Advanced',
    items: [
        { text: 'Random', type: 'random', icon: <i className="fas fa-random"/>},
        { text: 'Set', type: 'set', icon: <i className="fas fa-code"/> },
        { text: 'If', type: 'if', icon: <i className="fas fa-code-branch"/>},
        { text: 'Capture', type: 'capture', icon: <i className="fas fa-microphone"/> },
        { text: 'Flow', type: 'flow', icon: <i className="fas fa-clone"/> },
        { text: 'API', type: 'api', icon: <i className="fas fa-globe"/> },
        // { text: 'Mail', type: 'mail', icon: <i className="far fa-envelope"/> },
        { text: 'Permissions', type: 'permissions', icon: <i className="fas fa-lock"/> },
   ]
}];

const tabs = [
    {tab: "blocks", icon: <i className="fas fa-plus-square"/>},
    {tab: "project", icon: <i className="fas fa-folder"/>},
    {tab: "variables", icon: <i className="fas fa-code"/>},
    // {tab: "modules", icon: <i className="fas fa-layer-group"/>},
    // {tab: "templates", icon: <i className="fas fa-th-large"/>}
]

class Menu extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            open: true,
            tab: 'blocks',
            new_var: '',
            tree: null
        }

        this.openTab = this.openTab.bind(this);
        this.addVariable = this.addVariable.bind(this);
        this.deleteVariable = this.deleteVariable.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.buildTree = this.buildTree.bind(this);
        this.updateTree = this.updateTree.bind(this);
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

                <FlowButton flow={node} active={this.props.current} enterFlow={this.props.enterFlow} updateTree={this.updateTree}/>

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
        if(isVarName(new_var) && !variables.includes(new_var)){
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

    deleteVariable(variable){
        let variables = this.props.variables;
        let index = variables.indexOf(variable);
        if (index !== -1) variables.splice(index, 1);
        this.props.onVariable(variables);
    }

    render() {

        let content;
        if(this.state.tab === 'blocks'){
            content = sections.map((section, i) => {
                return <div key={i} className="section no-select">
                    <span className="section-title">{section.title}</span>
                    {section.items.map((item, i) => {
                        return <MenuItem item={item} key={i} />;
                    })}
                </div>
            })
        }else if(this.state.tab === 'project'){
            // content = this.props.diagrams.map((diagram, i) => 
            //     <div className="diagram-block" key={i} onClick={()=>this.props.enterFlow(diagram.id)}>
            //         {diagram.name}
            //     </div>
            // );

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
                </React.Fragment>}
            </React.Fragment>;
        }else if(this.state.tab === 'variables'){
            content = <React.Fragment>
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
                            if(defaultVariables[variable]){
                                return <div key={variable} className="variable_tag default">{'{' + variable + '}'}</div>
                            }else{
                                return <div key={variable} className="variable_tag">{'{' + variable + '}'} <span onClick={() => this.deleteVariable(variable)}><i className="fas fa-times"></i></span></div>
                            }
                        }.bind(this)) : <span className="text-muted">No Existing Variables</span>}
                    </div>
                </div>
            </React.Fragment>
        }else if(this.state.tab === 'modules'){
            if(this.props.user_modules){
                content = 
                <div>
                {this.props.user_modules.map((user_module, i) => {
                    return <ModuleItem module={user_module} key={i} />;
                })}
                </div>
            }else{
                content = <div>No flows, visit Marketplace</div>
            }
        }else if(this.state.tab === 'templates'){
            if(this.props.user_templates){
                content = 
                <div>
                {this.props.user_templates.map((user_template, i) => {
                    return <TemplateItem onTemplateChoice={this.props.onTemplateChoice} module={user_template} key={i} />;
                })}
                </div>
            }else{
                content = <div>No templates, visit Marketplace</div>
            }
        }

        return (
            <div className="Menu">
                <div className='toolbar'>
                    <div className="top-down">
                        {tabs.map((tab, i) => {
                            return (
                                <div key={i} 
                                    className={"tool" + ((tab.tab === this.state.tab && this.state.open) ? ' active' : '')} 
                                    onClick={() => this.openTab(tab.tab)}>
                                    {tab.icon}
                                </div>
                            )
                        })}
                    </div>
                    <div className="spacer"/>
                    <div className="bottom-up">
                        
                        <a className="tool no-underline" href="https://intercom.help/vfu"
                        target="_blank" rel="noopener noreferrer">
                            <i className="fas fa-graduation-cap"/>
                        </a>
                        <a className="tool no-underline" href="https://www.facebook.com/groups/199476704186240/" 
                        target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-facebook-f"/>
                        </a>
                        <div className="tool" onClick={this.props.helpModal}>
                            <i className="fas fa-question-circle"/>
                        </div>
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
