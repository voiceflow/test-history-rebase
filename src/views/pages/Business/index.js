import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Business.css';
import Template from './Template';
import Templates from './Templates';
import Home from './Home';

const tabs = [
    {
        display: <React.Fragment><i className="fal fa-home"/> Home</React.Fragment>,
        match: ['default'],
        link: '/business'
    },
    {
        display: <React.Fragment><i className="fal fa-envelope"/> Email</React.Fragment>,
        match: ['email', 'template'],
        link: '/business/email/templates'
    },
]

class Business extends Component {

    render() {
        let page;
        switch(this.props.page){
            case 'email':
                page = <Templates {...this.props}/>
                break;
            case 'template':
                page = <Template {...this.props}/>
                break;
            default:
                page = <Home user={this.props.user}/>
        }

        return (
            <div className="business Window">
                <div md="3" className="sidebar">
                    <div className="title">
                        Tools
                    </div>
                    {tabs.map((tab, i) => {
                        if(tab.match.includes(this.props.page)){
                            return <div key={i} className="sidebar-option active">
                                {tab.display}
                            </div>
                        }else{
                            return <Link key={i} to={tab.link} className="sidebar-option">
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
