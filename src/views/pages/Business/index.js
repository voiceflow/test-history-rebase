import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './Business.css';
import Template from './Template'
import Templates from './Templates'
import Home from './Home'

const updateLink = (link, skill_id) => {
    return link.replace(':skill_id', skill_id)
}

const tabs = [
    {
        display: <React.Fragment><i className="fal fa-home mr-2"/> Home</React.Fragment>,
        match: ['home'],
        link: '/business/:skill_id'
    },
    {
        display: <React.Fragment><i className="fal fa-envelope mr-2"/> Email</React.Fragment>,
        match: ['emails', 'template'],
        link: '/business/:skill_id/email/templates'
    },
]

class Business extends Component {

    render() {
        let page;
        switch(this.props.page){
            case 'emails':
                page = <Templates {...this.props}/>
                break;
            case 'template':
                page = <Template {...this.props}/>
                break;
            default:
                page = <Home user={this.props.user}/>
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

export default Business;
