import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import './Business.css'
import AccountLinkTemplate from './AccountLinkTemplate'
import Email from './Email'
import Emails from './Emails'
import Home from './Home'
import Products from './Products/Products';
import EditProduct from './Products/EditProduct';

const PAID_FEATURES = ['Multi-Platform Publishing', 'In-depth Analytics', 'Email Automation', 'Business Support', 'In Skill Purchases', 'Project Backups']

const updateLink = (link, skill_id) => {
    return link.replace(':skill_id', skill_id)
}

const tabs = [
    {
        display: <React.Fragment><i className="far fa-tachometer-alt mr-2"/> Dashboard</React.Fragment>,
        match: ['home'],
        link: '/business/:skill_id'
    },
    {
        display: <React.Fragment><i className="far fa-envelope mr-2"/> Email</React.Fragment>,
        match: ['emails'],
        link: '/business/:skill_id/emails'
    },
    {
        display: <React.Fragment><i className="far fa-cube mr-2"/> Products</React.Fragment>,
        match: ['products'],
        link: '/business/:skill_id/products'
    },
    {
      display: <React.Fragment><i className="far fa-link mr-2"/> Link Account</React.Fragment>,
      match: ['link_account', 'link_template'],
      link: '/business/:skill_id/link_account/templates'
    }
]

class Business extends Component {
    render() {
        let page
        if(window.user_detail.admin > 0){
            switch(this.props.page){
                case 'link_account':
                     page = <AccountLinkTemplate {...this.props}/>
                     break;
                case 'emails':
                    page = <Emails {...this.props}/>
                    break
                case 'email':
                    page = <Email {...this.props}/>
                    break
                case 'products':
                    page = <Products {...this.props}/>
                    break
                case 'product':
                    page = <EditProduct {...this.props}/>
                    break
                default:
                    page = <Home {...this.props}/>
            }
        }else{
            page = <div className="w-100 h-100">
                <div className="d-flex justify-content-center mt-5">
                    <div className="card" id="upgrade">
                        <h2>Upgrade to access business features</h2>
                        <p className="text-muted">To gain access to business features such as analytics, In-skill purchasing and Email automation upgrade your Voiceflow account to a paid tier</p>
                        {PAID_FEATURES.map((feature, i) => <p key={i}><img src="/images/icons/circle_check.svg" width={18} className="mr-3" alt="check"/>{feature}</p>)}
                        <div className="mt-2">
                            <button className="btn-primary" onClick={() => this.props.history.push('/account/upgrade')}>
                                Upgrade Plan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
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
    skill_id: state.skills.skill.skill_id,
    project_id: state.skills.skill.project_id
})

export default connect(mapStateToProps)(Business);
