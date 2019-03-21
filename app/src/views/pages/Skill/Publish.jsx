import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';

import PublishAmazon from './PublishAmazon'
import PublishMarket from '../PublishMarket/PublishMarket'
import PublishGoogle from './PublishGoogle'
import cloneDeep from 'lodash/cloneDeep';

import { Badge, Button } from 'reactstrap';

const PAID_FEATURES = ['Multi-Platform Publishing', 'In-depth Analytics', 'Email Automation', 'Business Support', 'In Skill Purchases', 'Project Backups']

const updateLink = (link, skill_id) => {
    return link.replace(':skill_id', skill_id)
}

const tabs = [
    {
        display: (key) => <React.Fragment key={key}><i className="fab fa-amazon mr-2" /> Alexa</React.Fragment>,
        match: ['alexa'],
        link: '/publish/:skill_id'
    },
    {
        display: (key) => <React.Fragment key={key}><i className="fab fa-google mr-2"></i> Google <Badge color="primary" className="ml-2">Beta</Badge></React.Fragment>,
        match: ['google'],
        link: '/publish/:skill_id/google'
    }
]

class Publish extends Component {
    constructor(props) {
        super(props)

        let TABS = cloneDeep(tabs)
        if (window.user_detail.admin >= 100) {
            TABS.push({
                display: (key) => <React.Fragment key={key}><i className="far fa-store-alt mr-2" /> Marketplace</React.Fragment>,
                match: ['market'],
                link: '/publish/:skill_id/market'
            })
        }

        this.state = {
            tabs: TABS
        }
    }

    render() {
        let page;
        if (this.props.page === 'market') {
            page = <PublishMarket {...this.props} />
        } else if (this.props.page === 'google') {
            if (window.user_detail.admin === -1 && this.props.platform !== 'google') { // Multiplatform paywall soft-disable
                page = <div className="w-100 h-100">
                <div className="d-flex justify-content-center mt-5">
                    <div className="card" id="upgrade">
                        <h2>Upgrade to publish simultaneously to Alexa and Google</h2>
                        <p className="text-muted">To gain access to business features such as Multi-Platform Publishing, upgrade your Voiceflow account to a paid tier</p>
                        {PAID_FEATURES.map((feature, i) => <p key={i}><img src="/icon/blue_check.svg" width={25} className="mr-3" alt="check"/>{feature}</p>)}
                        <div className="mt-2">
                            <Button className="purple-btn" onClick={() => this.props.history.push('/account/upgrade')}>
                                Upgrade Plan
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            } else {
                page = <PublishGoogle {...this.props} />
            }
        } else {
            if (window.user_detail.admin === -1 && this.props.platform !== 'alexa') { // Multiplatform paywall soft-disable
                page = <div className="w-100 h-100">
                <div className="d-flex justify-content-center mt-5">
                    <div className="card" id="upgrade">
                        <h2>Upgrade to publish simultaneously to Alexa and Google</h2>
                        <p className="text-muted">To gain access to business features such as Multi-Platform Publishing, upgrade your Voiceflow account to a paid tier</p>
                        {PAID_FEATURES.map((feature, i) => <p key={i}><img src="/icon/blue_check.svg" width={25} className="mr-3" alt="check"/>{feature}</p>)}
                        <div className="mt-2">
                            <Button className="purple-btn" onClick={() => this.props.history.push('/account/upgrade')}>
                                Upgrade Plan
                            </Button>
                        </div>
                    </div>
                </div>
            </div>            } else {
                page = <PublishAmazon {...this.props} />
            }        
        }

        return (
            <div id="business">
                <div md="3" className="sidebar-nav">
                    {this.state.tabs.map((tab, i) => {
                        let res
                        if (tab.match.includes(this.props.page)) {
                            res = <div className="nav-item active">
                                {tab.display(i)}
                            </div>
                        } else {
                            res = <Link to={updateLink(tab.link, this.props.skill_id)} className="nav-item">
                                {tab.display(i)}
                            </Link>
                        }
                        return (
                            <React.Fragment key={i}>
                                {res}
                            </React.Fragment>
                        )
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
    skill_id: state.skills.skill.skill_id,
    platform: state.skills.skill.platform,
})

export default connect(mapStateToProps)(Publish)
