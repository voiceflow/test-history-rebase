import React, { PureComponent } from 'react';
import MenuItem from './components/MenuItem';
import ModuleItem from './components/ModuleItem';
import { Link } from 'react-router-dom'
import { Button, Collapse } from 'reactstrap';
// import { Button, Collapse, ButtonGroup } from 'reactstrap';
import {getSections, checkBlockDisabledLive} from './../Blocks'
// const TABS = ['blocks', 'modules']

class Blocks extends PureComponent {
    constructor(props) {
        super(props);

        // Store state of basic + advanced tabs
        let show = localStorage.getItem('show')
        if(!show){
            show = {
                basic: true,
                logic: false,
                advanced: false,
                functional: false,
                business: false
            }
        } else {
            show = JSON.parse(show)
        }

        let tab = localStorage.getItem('block_tab')
        if(!tab) tab = 'blocks'

        this.state = {
            tab: tab,
            show: show,
            sections: getSections()
        }

        this.toggleBlockSection = this.toggleBlockSection.bind(this)
        this.switchTab = this.switchTab.bind(this)
    }

    switchTab(tab){
        if(tab !== this.state.tab){
            this.setState({
                tab: tab
            }, ()=>localStorage.setItem('block_tab', tab))
        }
    }

    toggleBlockSection(section_title){
        let s = this.state
        s.show[section_title] = !s.show[section_title]
        localStorage.setItem('show', JSON.stringify(s.show))
        this.setState(s)
        this.forceUpdate()
    }

    render() {
        let block_content;
        if(this.state.tab === 'blocks'){
            block_content =
                this.state.sections.map((section, i) => {
                    return <div key={i} className="section no-select">
                        <div
                            className="section-title"
                            onClick={() => {this.toggleBlockSection(section.title)}}>
                                <span>
                                <i className={"fas fa-caret-down mr-1 rotate" + (this.state.show[section.title] ? "" : " fa-rotate--90")}/>
                                {section.title}
                                </span>
                                <span className={"title-dot " + section.title}/>
                        </div>
                        <Collapse isOpen={this.state.show[section.title]}>
                            {(section.title === 'business' && window.user_detail.admin === 0) ?
                                <div className="premium-block">
                                    <div>
                                        <span>Upgrade to access these premium features</span>
                                        <Link className="purple-btn mt-3 d-block no-underline" to='/account/upgrade'>
                                            Upgrade
                                        </Link>
                                    </div>
                                </div>
                            : null}
                            <div className="mb-3 section-blocks" style={(section.title === 'business' && window.user_detail.admin === 0) ? {opacity: 0.3} : null}>
                                {section.items.map((item, i) => {
                                    return <MenuItem 
                                        item={item} 
                                        key={i} 
                                        data-tip={item.tip} 
                                        draggable={((section.title === 'business' && window.user_detail.admin === 0) || checkBlockDisabledLive(this.props.live_mode, item.type)) ? false : true}
                                        platform={this.props.platform}/>
                                })}
                            </div>
                        </Collapse>
                    </div>
            })
        } else {
            if(this.props.user_modules.length > 0){
                block_content =
                <div>
                {this.props.user_modules.map((user_module, i) => {
                    return <ModuleItem module={user_module} key={i} />;
                })}
                </div>
            }else{
                block_content = <div className="mt-2 text-center text-muted"><img className="image-editor mt-4 mb-3" src="/empty.png" alt="empty"/>You have no flows, visit the marketplace to get some! <Button color="primary mt-3" onClick={() => {this.props.history.push('/market')}}>Marketplace</Button></div>
            }
        }
        return <React.Fragment>
            {/* <ButtonGroup className="toggle-group mb-2">
                {TABS.map(tab => {
                    return <Button
                        key={tab}
                        onClick={() => this.switchTab(tab)}
                        outline={this.state.tab !== tab}
                        disabled={this.state.tab === tab}>
                        {tab}
                    </Button>
                })}
            </ButtonGroup> */}
            {block_content}
        </React.Fragment>
    }
}

export default Blocks;
