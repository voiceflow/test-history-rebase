import cn from 'classnames'
import React, { PureComponent } from 'react';
import MenuItem from './components/MenuItem';
import ModuleItem from './components/ModuleItem';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Collapse } from 'reactstrap';
import {getSections, checkBlockDisabledLive} from './../Blocks'

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
                symbols: false,
                flows: false
            }
        } else {
            show = JSON.parse(show)
        }

        let tab = localStorage.getItem('block_tab')
        if(!tab) tab = 'blocks'

        this.state = {
            tab: tab,
            show: show,
            sections: getSections(this.props.type_counter, this.props)
        }

        this.toggleBlockSection = this.toggleBlockSection.bind(this)
    }

    componentWillReceiveProps(props){
        if(props.type_counter !== this.props.type_counter || props.user_modules !== this.props.user_modules){
            let sections = getSections(props.type_counter, props)
            this.setState({
                sections: sections
            })
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
        let block_content
        if(this.state.tab === 'blocks'){
            block_content =
                this.state.sections.map((section, i) => {
                    return <div key={i} className="section no-select">
                        <div
                            className="section-title"
                            onClick={() => {this.toggleBlockSection(section.title)}}>
                                <span>
                                <i className={cn('fas', 'fa-caret-down', 'mr-1', 'rotate', {
                                    'fa-rotate--90': !this.state.show[section.title]
                                })}/>
                                {section.title}
                                </span>
                                <span className={cn(section.title, {
                                    'title-dot': section.title !== 'favorites'
                                })}/>
                        </div>
                        <Collapse isOpen={this.state.show[section.title]}>
                            {(section.title === 'business' && this.props.user.admin === 0) ?
                                <div className="premium-block">
                                    <div>
                                        <span>Upgrade to access these premium features</span>
                                        <Link className="btn-primary mt-3 d-block no-underline" to='/account/upgrade'>
                                            Upgrade
                                        </Link>
                                    </div>
                                </div>
                            : null}
                            <div className="mb-3 section-blocks" style={(section.title === 'business' && this.props.user.admin === 0) ? {opacity: 0.3} : null}>
                                {section.items.map((item, i) => {
                                        if(item && item.type === 'marketplace_link'){
                                            return <div className="wrap" key={i}>
                                                <div className='MenuItem dashed text-center pt-2' onClick={() => {this.props.history.push(`/market/${this.props.skill_id}`)}}>
                                                    <span className="text-secondary">Add Flows</span>
                                                </div>
                                            </div>
                                        } else if(item && item.module_id){
                                            return <ModuleItem
                                            item={item}
                                            key={i}
                                            data-tip={item.tip}
                                            draggable={true}/>
                                        } else if(item){ 
                                            return <MenuItem 
                                            item={item} 
                                            key={i} 
                                            data-tip={item.tip}
                                            draggable={((section.title === 'business' && this.props.user.admin === 0) || checkBlockDisabledLive(this.props.live_mode, item.type)) ? false : true}/>
                                        }
                                        return null
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
            {block_content}
        </React.Fragment>
    }
}

const mapStateToProps = state => ({
    live_mode: state.skills.live_mode,
    diagrams: state.diagrams.diagrams,
    skill_id: state.skills.skill.skill_id,
    project_id: state.skills.skill.project_id,
    user_modules: state.skills.user_modules,
    user: state.account
})
export default connect(mapStateToProps)(Blocks);
