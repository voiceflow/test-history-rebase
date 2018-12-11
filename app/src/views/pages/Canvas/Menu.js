import React, { PureComponent } from 'react'
import {Tooltip} from 'react-tippy'
import FlowButton from './Sidebars/components/FlowButton'
import Blocks from './Sidebars/Blocks'
import Variables from './Sidebars/Variables'
import Project from './Sidebars/Project'
import Confirm from './../../components/Modals/ConfirmModal'
import {Alert} from 'reactstrap'
import axios from 'axios'

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
        super(props)

        let tab = localStorage.getItem('tab')
        if(!tab) tab = 'blocks'

        this.state = {
            open: true,
            tab: tab,
            tree: null,
            confirm: null
        }

        this.openTab = this.openTab.bind(this)
        this.buildTree = this.buildTree.bind(this)
        this.updateTree = this.updateTree.bind(this)
        this.renderSideBar = this.renderSideBar.bind(this)
        this.copyFlow = this.copyFlow.bind(this)
        this.deleteFlow = this.deleteFlow.bind(this)
        this.renameFlow = this.renameFlow.bind(this)
        this.visited = new Set();
    }

    renameFlow(flow_id, name, cb){
        name = name.trim()
        let index = this.props.diagrams.findIndex(d => d.id === flow_id)
        if(index !== -1){
            let flow = this.props.diagrams[index]
            if(flow.name !== name){
                // Make sure that names are unique
                let find = this.props.diagrams.find(d => d.name === name)
                if(find){
                    return this.setState({
                        confirm: {
                            text: 'Flow names must be unique',
                            confirm: () => this.setState({confirm: null})
                        }
                    })
                }

                let old_name = flow.name
                this.props.diagrams[index].name = name

                axios.post(`/diagram/${flow.id}/name`, {name: name})
                .then(() => {
                    this.props.onFlowRenamed(flow.id)
                })
                .catch(err => {
                    alert('Error - Name not Updated');
                    this.props.diagrams[index].name = old_name;
                });
            }
        }
    }

    copyFlow(flow_id){

        let that = this

        let flow = this.props.diagrams.find(d => d.id === flow_id)
        if(!flow){
            return
        }

        this.props.changeLoading(true)
        const copy = (save=true) => {

            let new_flow_name = flow.name + ' (COPY)'
            let index = 1
            const exists = (name) => this.props.diagrams.find(d => d.name === name)
            while(exists(new_flow_name)){
                new_flow_name = `${flow.name} (COPY ${index})`
                index++
            }

            axios.get(`/diagram/copy/${flow_id}?name=${encodeURI(new_flow_name)}`)
            .then((res) => {
                this.props.diagrams.push({
                    id: res.data,
                    name: new_flow_name
                })
                this.props.enterFlow(res.data, save)
            })
            .catch((err) => {
                this.props.changeLoading(false)
                that.setState({
                    text: <Alert color="danger">Unable to Copy Flow</Alert>,
                    confirm: {
                        confirm: that.setState({confirm: null})
                    }
                })
            })
        }

        if(flow_id === this.props.current){
            this.props.onSave(()=>{
                copy(false)
            })
        }else{
            copy(true)
        }
    }

    deleteFlow(flow_id){
        this.setState({
            confirm: {
                warning: true,
                text: <Alert color="danger" className="mb-0">
                  <i className="fas fa-exclamation-triangle fa-2x"/><br/>
                  Deleting this flow permanently deletes everything inside and can not be recovered
                  <br/><br/>
                  Are you sure?
                </Alert>,
                confirm: () => {
                    this.setState({confirm: null})
                    axios.delete('/diagram/' + flow_id)
                    .then(() => {
                        let index = this.props.diagrams.findIndex(d => d.id === flow_id)
                        if(index !== -1){
                            this.props.diagrams.splice(index, 1)
                            this.updateTree(this.props.current)
                        }
                        // If they are deleting the flow they are currently on, go back to ROOT
                        if(flow_id === this.props.current){
                            for(let diagram of this.props.diagrams){
                                if(diagram.name === 'ROOT'){
                                    this.props.enterFlow(diagram.id, false)
                                }
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        alert('failed to delete diagram')
                    })
                } 
            }
        })
    }

    componentDidMount() {
        this.props.build(this.updateTree)
    }

    buildTree(node, current_id, depth=0){
        if(depth < 4) {
            this.visited.add(node.id)

            let tree
            let sub_diagrams
            if(node.sub_diagrams){
                sub_diagrams = node.sub_diagrams;
            }

            if(Array.isArray(sub_diagrams) && sub_diagrams.length !== 0){
                
                tree = sub_diagrams.map((diagram_id, i) => {
                    let block = this.props.diagrams.find(d => d.id === diagram_id);

                    if(block){
                        return <div className="sub-diagram" key={i}>
                            <div className="sub-column">
                                {this.buildTree(block, current_id, depth+1)}
                            </div>
                        </div>;
                    }
                    return null
                })
            }

            return (<React.Fragment>
                <FlowButton 
                    flow={node} 
                    active={current_id} 
                    enterFlow={this.props.enterFlow} 
                    renameFlow={this.renameFlow}
                    copyFlow={()=>this.copyFlow(node.id)}
                    deleteFlow={()=>this.deleteFlow(node.id)}
                />
                {tree}
            </React.Fragment>)

        } else {
            return <div className='diagram-block'>...</div>;
        }
    }

    updateTree(current_id) {
        for(let diagram of this.props.diagrams){
            if(diagram.name === 'ROOT'){
                this.visited = new Set()
                this.setState({
                    tree: this.buildTree(diagram, current_id)
                })
            }
        }
    }

    openTab(tab) {
        if(tab !== this.state.tab || !this.state.open){
            this.setState({
                open: true,
                tab: tab
            }, () => localStorage.setItem('tab', tab))
        }
    }

    renderSideBar(){
        switch(this.state.tab){
            case 'blocks':
                return <Blocks user_modules={this.props.user_modules}/>
            case 'variables':
                return <Variables 
                    variables={this.props.variables} 
                    global_variables={this.props.global_variables}
                    onGlobalVariable={this.props.onGlobalVariable}
                    onVariable={this.props.onVariable}
                />
            default:
                return <Project
                    diagrams={this.props.diagrams}
                    tree={this.state.tree}
                    current={this.props.current}
                    visited={this.visited}
                    renameFlow={this.renameFlow}
                    enterFlow={this.props.enterFlow}
                    copyFlow={this.copyFlow}
                    deleteFlow={this.deleteFlow}
                />
        }
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
                    content = <div className="mt-2 text-center"><img className="image-editor mt-4 mb-3" src={"/empty.png"}/>You have no flows, visit the marketplace to get some! <Button color="primary mt-3" onClick={() => {this.props.history.push('/market')}}>Marketplace</Button></div> 
                }
            }
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
                    <hr className='mb-2 mt-4'/>                
                </React.Fragment>}
                <label>Templates</label>
                {this.props.user_templates.length > 0?
                    <div>
                    {this.props.user_templates.map((user_template, i) => {
                        return <TemplateItem onTemplateChoice={this.props.onTemplateChoice} module={user_template} key={i} />;
                    })}
                    </div>
                    :
                    <div>You have no templates <span role="img" aria-label="crying emoji">😭</span> visit <Button color="link" className="pl-0 pr-0 pt-0 pb-0" onClick={() => {this.props.history.push('/market')}}>Marketplace</Button> to get some!</div>
                }
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
        } 

        let block_module_group;
        if(this.state.tab === 'blocks'){
            block_module_group = 
                <ButtonGroup className="toggle-group mb-2">
                    <Button outline={this.state.block_tab_state !== 'blocks'} onClick={() => {this.setState({block_tab_state: 'blocks'})}} disabled={this.state.block_tab_state === 'blocks'}> Blocks </Button>
                    <Button outline={this.state.block_tab_state !== 'modules'} onClick={() => {this.setState({block_tab_state: 'modules'})}} disabled={this.state.block_tab_state === 'modules'}>Flows</Button>
                </ButtonGroup>
        } else {
            block_module_group = null;
        }

        if(this.state.tab === 'modules'){
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
        } else if(this.state.tab === 'templates'){
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
            <div className="Menu" onClick={this.props.onClick}>
                <Confirm confirm={this.state.confirm} toggle={()=>this.setState({confirm: null})}/>
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
                <div id="sidebar" className={(this.state.open ? 'open' : '')}>
                    {this.props.loading_diagram ? 
                        null :
                        <React.Fragment>
                            <div>
                                <div className='block-title no-select' onClick={() => this.setState({open: false})}>
                                    <h5 className="mb-0">{this.state.tab}</h5>
                                    <div className="close pr-1 pl-3 py-3">×</div>
                                </div>
                            </div>
                            <div className="sidebar-content">
                                {this.renderSideBar()}
                            </div>
                        </React.Fragment>
                    }
                </div>
            </div>
        );
    }
}

export default Menu;
