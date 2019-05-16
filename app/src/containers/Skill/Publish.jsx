import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';

import PublishAmazon from './PublishAmazon'
import PublishMarket from '../PublishMarket/PublishMarket'
import PublishGoogle from './PublishGoogle'
import cloneDeep from 'lodash/cloneDeep';

import { Badge} from 'reactstrap';

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
        display: (key) => <React.Fragment key={key}><i className="fab fa-google mr-2"></i> Google <Badge color="primary" className="beta-badge align-middle ml-1">Beta</Badge></React.Fragment>,
        match: ['google'],
        link: '/publish/:skill_id/google'
    }
]

class Publish extends Component {
    constructor(props) {
        super(props)

        let TABS = cloneDeep(tabs)
        // MARKETPLACE BETA
        if (this.props.user.admin === 7) {
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
          page = <PublishGoogle {...this.props} />
        } else {
          page = <PublishAmazon {...this.props} />
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
  user: state.account,
  skill_id: state.skills.skill.skill_id,
  platform: state.skills.skill.platform,
})

export default connect(mapStateToProps)(Publish)
