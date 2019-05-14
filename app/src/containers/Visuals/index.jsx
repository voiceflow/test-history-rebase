import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Multimodal from './Multimodal'
import Display from './Display'

const updateLink = (link, skill_id) => {
    return link.replace(':skill_id', skill_id)
}

const tabs = [
    {
        display: <React.Fragment><i className="far fa-image"/> Multimodal</React.Fragment>,
        match: ['multimodal', 'displays'],
        link: '/visuals/:skill_id'
    }
]

class Business extends Component {

    render() {
        let page

        switch(this.props.page){
            case 'display':
                page = <Display {...this.props}/>
                break
            default:
                page = <Multimodal {...this.props}/>
        }

        return (
            <div id="business">
                <div md="3" className="sidebar-nav">
                    {tabs.map((tab, i) => {
                        if(tab.match.includes(this.props.page)){
                            return <div key={i} className="nav-item active">
                                {tab.display}
                            </div>
                        }else{
                            return <Link key={i} to={updateLink(tab.link, this.props.skill_id)} className="nav-item">
                                {tab.display}
                            </Link>
                        }
                    })}
                </div>
                <div md="9" className="business-page">
                    {page}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    skill_id: state.skills.skill.skill_kd
})
export default connect(mapStateToProps)(Business);
