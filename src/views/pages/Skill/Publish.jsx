import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import PublishAmazon from './PublishAmazon'
import PublishMarket from '../PublishMarket/PublishMarket'
import cloneDeep from 'lodash/cloneDeep';

const updateLink = (link, skill_id) => {
    return link.replace(':skill_id', skill_id)
}

const tabs = [
    {
        display: <React.Fragment><i className="fab fa-amazon mr-2"/> Alexa</React.Fragment>,
        match: ['alexa'],
        link: '/publish/:skill_id'
    }
]

class Publish extends Component {
    constructor(props){
        super(props)
        this.state = {
            tabs: []
        }

        if(window.user_detail.admin >= 100){
            this.state.tabs = [...cloneDeep(tabs), {
                display: <React.Fragment><i className="far fa-store-alt mr-2"/> Marketplace</React.Fragment>,
                match: ['market'],
                link: '/publish/:skill_id/market'
            }]
        }
    }

    render() {
        let page;
        if(this.props.page === 'market'){
            page = <PublishMarket {...this.props}/>
        } else {
            page = <PublishAmazon {...this.props}/>
        }

        return (
            <div id="business">
                <div md="3" className="sidebar-nav">
                    {this.state.tabs.map((tab, i) => {
                        if(tab.match.includes(this.props.page)){
                            return <div key={i} className="nav-item active">
                                {tab.display}
                            </div>
                        }else{
                            return <Link key={i} to={updateLink(tab.link, this.props.skill.skill_id)} className="nav-item">
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
