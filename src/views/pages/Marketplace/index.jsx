import React, { Component } from 'react'
import { Link } from 'reactstrap'
import { connect } from 'react-redux'
// import { updateVersion } from './../../../actions/versionActions'
import FlowMarket from './FlowMarket'

const updateLink = (link, skill_id) => {
  console.log(skill_id)
  return link.replace(':skill_id', skill_id)
}

const TABS = [
  {
      display: <React.Fragment><i className="far fa-tachometer-alt mr-2"/> Flows</React.Fragment>,
      match: ['flows'],
      link: '/market/:skill_id/flows'
  },
]

class Marketplace extends Component {
  constructor(props) {
    super(props)

    this.renderPage = this.renderPage.bind(this)
  }

  renderPage() {
    if(!this.props.skill_id) {
      return null
    }

    switch (this.props.page) {
      case "flows":
        return <FlowMarket {...this.props}></FlowMarket>
      default:
        return null
        // return <FlowMarket/></FlowMarket>
    }
  }

  render() {
    return (
      <div id="business">
        <div md="3" className="sidebar-nav">
          {TABS.map((tab, i) => {
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
          {this.renderPage()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  skill_id: state.skills.skill.skill_id
})

export default connect(mapStateToProps)(Marketplace)