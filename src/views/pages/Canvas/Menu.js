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
        {tab: "blocks", icon: <i className="fas fa-plus-square"></i>, tip: 'Blocks'},
        {tab: "project", icon: <i className="fas fa-folder"/>, tip: 'Project'},
        {tab: "variables", icon: <i className="fas fa-code"/>, tip: 'Variables'},
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
            case 'variables':
                return <Variables
                    variables={this.props.variables}
                    locked={this.props.preview}
                    global_variables={this.props.global_variables}
                    onGlobalVariable={this.props.onGlobalVariable}
                    onVariable={this.props.onVariable}
                />
            case 'project':
                return <Project
                    diagrams={this.props.diagrams}
                    tree={this.state.tree}
                    current={this.props.current}
                    visited={this.visited}
                    renameFlow={this.renameFlow}
                    enterFlow={this.props.enterFlow}
                    copyFlow={this.copyFlow}
                    deleteFlow={this.deleteFlow}
                    history={this.props.history}
                />
            default:
                return <Blocks user_modules={this.props.user_modules}/>
        }
    }

    render() {
        return (
            <div className="Menu"
                onFocus={this.props.unfocus}
                onMouseDown={this.props.unfocus}
                onKeyDown={this.props.unfocus}
            >
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
                                <div className='block-title no-select mb-3' onClick={() => this.setState({open: false})}>
                                    <h5 className="mb-0">{this.state.tab}</h5>
                                    <div className="close pl-3 py-3">&times;</div>
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
        // <a className="tool no-underline" href="/market" rel="noopener noreferrer">
        //     <i className="fas fa-store-alt"/>
        // </a>
    }
}

export default Menu;
