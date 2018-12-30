import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import PublishAmazon from './PublishAmazon'

const updateLink = (link, skill_id) => {
    return link.replace(':skill_id', skill_id)
}

const tabs = [
    {
        display: <React.Fragment><i className="fal fa-home mr-2"/> Alexa</React.Fragment>,
        match: ['alexa'],
        link: '/publish/:skill_id'
    }
]

class Publish extends Component {

    render() {
        let page;
        switch(this.props.page){
            default:
                page = <PublishAmazon {...this.props}/>
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

export default Publish;
