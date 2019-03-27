import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Tooltip} from 'react-tippy'
import { openTab, closeTab } from 'actions/userActions'
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

        // DO THIS IN MAPSTATE TO PROPS
        let tab = localStorage.getItem('tab')
        if(!tab) tab = 'blocks'

        this.state = {
            tree: null,
            depth: 0,
        }

        this.openTab = this.openTab.bind(this)
        this.buildTree = this.buildTree.bind(this)
        this.updateTree = this.updateTree.bind(this)
        this.renderSideBar = this.renderSideBar.bind(this)
        this.resize = this.resize.bind(this)
        this.visited = new Set();
        this.m_pos = 0;
    }

    componentWillReceiveProps(nextProps){
        if (localStorage.getItem('sideWidth') && this.sidebar && nextProps.open) {
            this.sidebar.style.width = localStorage.getItem('sideWidth')
        }
        if (nextProps.diagrams.length !== this.state.depth){
            this.updateTree(nextProps.current)
        }
    }

    resize(e){
        const dx = this.m_pos - e.x;
        if (this.sidebar.style.width && (e.clientX < 280 || e.clientX > 960)) return;
        this.m_pos = e.x;
        this.sidebar.style.width = (parseInt(getComputedStyle(this.sidebar, '').width) - dx) + "px";
    }

    componentDidMount() {
        this.props.build(this.updateTree)
        this.sidebar.addEventListener('mousedown', e => {
            if (!e.srcElement.classList.contains('MenuItem')){
                this.m_pos = e.x;
                document.addEventListener("mousemove", this.resize, false);
            }
        }, false);
        document.addEventListener("mouseup", () => {
            document.removeEventListener('mousemove', this.resize, false);
        })
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
        if(tab !== this.props.tab || !this.props.open){
            localStorage.setItem('tab', tab)
            this.props.setTab(tab)
        }
    }

    renderSideBar(){
        switch(this.props.tab){
            case 'variables':
                return <Variables
                    locked={this.props.preview}
                />
            case 'project':
                return <Project
                    tree={this.state.tree}
                    visited={this.visited}
                    enterFlow={this.props.enterFlow}
                    copyFlow={this.props.copyFlow}
                    deleteFlow={this.props.deleteFlow}
                    updateTree={this.updateTree}
                    history={this.props.history}
                />
            default:
                return <Blocks user_modules={this.props.user_modules} user={this.props.user} toggleUpgrade={this.props.toggleUpgrade} type_counter={this.props.type_counter}/>
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
                                <Tooltip key={i} title={tab.tip} position='right' disabled={true && tab.tab === this.props.tab && this.props.open}>
                                    <div className={"tool" + ((tab.tab === this.props.tab && this.props.open) ? ' active' : '')}
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
                <div id="sidebar" className={(this.props.open ? 'open' : '')} ref={ref => this.sidebar = ref}>
                 <div className="sidebar-container">
                    {this.props.loading_diagram ?
                        null :
                        <React.Fragment>
                            <div>
                                <div className='block-title no-select mb-3' onClick={() => {
                                    this.props.closeTab()
                                    localStorage.setItem('sideWidth', this.sidebar.style.width)
                                    this.sidebar.style.width = "240px"
                                }}>
                                    <h5 className="mb-0">{this.props.tab}</h5>
                                    <div className="close py-3">&times;</div>
                                </div>
                            </div>
                            <div className="sidebar-content">
                                {this.renderSideBar()}
                            </div>
                        </React.Fragment>
                    }
                    </div>
                </div>
            </div>
        );
        // <a className="tool no-underline" href="/market" rel="noopener noreferrer">
        //     <i className="fas fa-store-alt"/>
        // </a>
    }
}

const mapStateToProps = state => {
    let tab = localStorage.getItem('tab')
    return{
        diagrams: state.diagrams.diagrams,
        tab: tab ? tab : state.userSetting.tab,
        open: state.userSetting.menuOpen,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setTab: (tab) => dispatch(openTab(tab)),
        closeTab: () => dispatch(closeTab()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
