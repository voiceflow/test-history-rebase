import React, { Component } from 'react'
import {Tooltip} from 'react-tippy'
import FlowButton from './Sidebars/components/FlowButton'
import Blocks from './Sidebars/Blocks'
import Variables from './Sidebars/Variables'
import Project from './Sidebars/Project'

const tabs = {
    top: [
        {tab: "blocks", icon: <i className="fas fa-plus-square"></i>, tip: 'Blocks'},
        {tab: "project", icon: <i className="fas fa-clone"/>, tip: 'Project'},
        {tab: "variables", icon: <i className="fas fa-code"/>, tip: 'Variables'},
    ],
    bottom: [
        {link: "https://forum.getvoiceflow.com", icon: <i className="fas fa-question"/>, tip: 'Join the Voiceflow Forum for help & updates'},
        {link: "https://university.getvoiceflow.com/", icon: <i className="fas fa-graduation-cap"/>, tip: 'Access tutorials through Voiceflow University'},
        {link: "https://www.facebook.com/groups/199476704186240/", icon: <i className="fab fa-facebook-f"/>, tip: 'Join the Voiceflow Facebook Community'}
    ]
}

class Menu extends Component {
    constructor(props) {
        super(props)

        let tab = localStorage.getItem('tab')
        if(!tab) tab = 'blocks'

        this.state = {
            open: true,
            tab: tab,
            tree: null,
            depth: 0,
        }

        this.openTab = this.openTab.bind(this)
        this.buildTree = this.buildTree.bind(this)
        this.updateTree = this.updateTree.bind(this)
        this.renderSideBar = this.renderSideBar.bind(this)
        this.visited = new Set();
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.diagrams.length !== this.state.depth){
            this.updateTree(nextProps.current)
        }
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
                    renameFlow={this.props.renameFlow}
                    copyFlow={()=>this.props.copyFlow(node.id)}
                    preview={this.props.preview}
                    deleteFlow={()=>this.props.deleteFlow(node.id)}
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
                    tree: this.buildTree(diagram, current_id),
                    depth: this.props.diagrams.length,
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
                    onError={this.props.onError}
                />
            case 'project':
                return <Project
                    diagrams={this.props.diagrams}
                    tree={this.state.tree}
                    current={this.props.current}
                    visited={this.visited}
                    renameFlow={this.props.renameFlow}
                    enterFlow={this.props.enterFlow}
                    copyFlow={this.props.copyFlow}
                    deleteFlow={this.props.deleteFlow}
                    updateTree={this.updateTree}
                    history={this.props.history}
                />
            default:
                return <Blocks user_modules={this.props.user_modules} user={this.props.user} platform={this.props.platform} live_mode={this.props.live_mode} toggleUpgrade={this.props.toggleUpgrade}/>
        }
    }

    render() {
        return (
            <div className="Menu"
                onFocus={this.props.unfocus}
                onMouseDown={this.props.unfocus}
                onKeyDown={this.props.unfocus}
            >
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
