import React, { PureComponent } from 'react';
import MenuItem from './components/MenuItem';
import { connect } from 'react-redux'
import ModuleItem from './components/ModuleItem';
import { Link } from 'react-router-dom'
import { Button, Collapse } from 'reactstrap';
// import { Button, Collapse, ButtonGroup } from 'reactstrap';
import {getSections, checkBlockDisabledLive} from './../Blocks'
import axios from 'axios';
import withRenderModuleIcon from './../../../HOC/ModuleIcon'
// const TABS = ['blocks', 'modules']

export class Blocks extends PureComponent {
    constructor(props) {
        super(props);

        // Store state of basic + advanced tabs
        let show = localStorage.getItem('show')
        if(!show){
            show = {
                favorites: true,
                basic: true,
                logic: false,
                advanced: false,
                functional: false,
                business: false,
                symbols: false
            }
        } else {
            show = JSON.parse(show)
        }

        let tab = localStorage.getItem('block_tab')
        if(!tab) tab = 'blocks'

        this.state = {
            tab: tab,
            show: show,
            sections: getSections(this.props.type_counter)
        }

        this.toggleBlockSection = this.toggleBlockSection.bind(this)
        this.loadUserModules = this.loadUserModules.bind(this)
    }

    componentWillReceiveProps(props){
        if(props.type_counter !== this.props.type_counter){
            let sections = getSections(props.type_counter)
            if(this.state.module_section){
                sections.push(this.state.module_section)
            }
            this.setState({
                sections: sections
            })
        }
    }

    loadUserModules(){
        axios.get(`/marketplace/user_module`)
        .then(res => {
            let module_section = res.data.map(module => {
                let name = module.title.match(/\b(\w)/g)
                if(name) { name = name.join('') }
                else { name = module.title }
                name = name.substring(0,3)
                
                let module_colors = module.color.split('|')
                if(module_colors.length === 1){
                    module_colors = ['F86683', 'FEF2F4']
                }

                let icon_style = {
                    backgroundColor: `#${module_colors[1]}`,
                    color: `#${module_colors[0]}`
                }
                
                let icon = <div className="no-image module-image" style={icon_style}><h1>{name}</h1></div>

                return {
                    text: module.title,
                    type: 'symbol',
                    icon: icon,
                    tip: module.descr
                }
            })

            this.setState({
                module_section: {title: 'Flows', items: module_section}
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    componentDidMount(){
        this.loadUserModules()
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
        if (!window.user_detail) return null;
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
                                <span className={(section.title !== 'favorites' ? "title-dot " + section.title : section.title)}/>
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
                                {section.items.map((item, i) => 
                                    item && <MenuItem 
                                            item={item} 
                                            key={i} 
                                            data-tip={item.tip} 
                                            draggable={((section.title === 'business' && window.user_detail.admin === 0) || checkBlockDisabledLive(this.props.live_mode, item.type)) ? false : true}/>
                                )}
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
            {block_content}
        </React.Fragment>
    }
}

const mapStateToProps = state => ({
    live_mode: state.skills.live_mode
})
export default connect(mapStateToProps)(withRenderModuleIcon(Blocks));
