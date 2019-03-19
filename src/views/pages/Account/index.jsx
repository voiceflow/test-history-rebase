import React, { Component } from 'react'
import { connect } from 'react-redux'
import AuthenticationService from './../../../services/Authentication'
import UpgradeModal from './../../components/Modals/UpgradeModal'
import { setConfirm } from 'actions/modalActions'
import {Button, Alert} from 'reactstrap'
import moment from 'moment'
import axios from 'axios'
import './Account.css'

const UNLINKED = 0
const LOADING = 1
const LINKED = 2

const STATUS = {
  0: {name: "Community (Free)", price: "0"},
  1: {name: "Plus", price: "29"},
  30: {name: "Business", price: "199"},
  100: {name: "Admin", price: "100000000"}
}
const GET_STATUS = (status) => {
  if(status in STATUS){
    return STATUS[status]
  }else{
    return {name: 'Unknown', price: "0"}
  }
}

class Account extends Component {

  constructor(props) {
    super(props)

    this.state = {
      amzn: LOADING,
      google: LOADING,
      expiry: null,
    };

    this.handleChange = this.handleChange.bind(this)
    this.toggle = this.toggle.bind(this)
    this.resetAmazon = this.resetAmazon.bind(this)
    this.logout = this.logout.bind(this)
    this.resetGoogle = this.resetGoogle.bind(this)
  }

  resetAmazon() {
    this.props.setConfirm({
        text: <Alert color="danger" className="mb-0">
          <i className="fas fa-exclamation-triangle fa-2x"/><br/>
          Resetting your Amazon Account is dangerous and will de-sync all your published projects. Do not reset unless you know what you are doing
        </Alert>,
        warning: true,
        confirm: () => {
          this.setState({amzn: LOADING}, () => {
            axios.delete('/session/amazon').then(()=>{
              this.setState({amzn: UNLINKED, profile: null})
            })
            .catch(err => {
              this.setState({amzn: LINKED})
              alert('Failed to Delete Amazon Account Association =')
            })
          })
        }
    })
  }

  resetGoogle() {
    this.props.setConfirm({
        text: <Alert color="danger" className="mb-0">
          <i className="fas fa-exclamation-triangle fa-2x"/><br/>
          Resetting your Google Account is dangerous and will de-sync all your published projects. Do not reset unless you know what you are doing
        </Alert>,
        warning: true,
        confirm: () => {
          this.setState({google: LOADING}, () => {
            axios.delete('/session/google/access_token').then(()=>{
              this.setState({google: UNLINKED})
            })
            .catch(err => {
              this.setState({google: LINKED})
              alert('Failed to unlink Google Account')
            })
          })
        }
    })
  }

  componentDidMount() {
      AuthenticationService.AmazonAccessToken(data => {
        if(data){
          this.setState({
              amzn: !!data.token ? LINKED : UNLINKED,
              token: data.token,
              profile: data.profile
          })
        } else {
          this.setState({
            amzn: UNLINKED,
          })
        }
      })

      AuthenticationService.googleAccessToken().then(g_token => {
        this.setState({
          google: !!g_token ? LINKED : UNLINKED
        })
      })

      axios.get('/user')
      .then(res => {
        if(res.data && !isNaN(res.data.expiry) && (res.data.expiry*1000) > Date.now()){
          this.setState({
            expiry: moment.unix(res.data.expiry).fromNow()
          })
        }
      })
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  toggle() {
    if(this.props.upgrade){
      this.props.history.push('/account')
    }else{
      this.props.history.push('/account/upgrade')
    }
  }

  renderButton(stage, action){
    switch(stage){
      case LOADING:
        return <Button color="clear" className="purple-btn"><span className="loader"/></Button>
      case UNLINKED:
        return <Button color="clear" className="purple-btn" disabled>Unlinked</Button>
      default:
        return <Button onClick={action} className="purple-btn">Reset</Button>
    }
  }

  logout(e) {
    e.preventDefault();
    AuthenticationService.logout(() => {
      this.props.history.push('/login');
    });
    return false;
  }

  render() {
    return <div id="app" className="pt-6">
              <div className="subheader">
                  <div className="container space-between">
                      <span className="subheader-title">
                          Account
                          <div className="hr-label">
                              <small><i className="far fa-user mr-1"></i></small>{' '}
                              {this.props.user.name}{' '}
                          </div>
                      </span>
                  </div>
              </div>
              <UpgradeModal
                upgrade_modal={this.props.upgrade}
                toggle={this.toggle}
                selected_plan={this.state.selected_plan}
                user={this.props.user}
                logout={this.logout}
              />
              <div className="container my-5 pt-4">
                <h5 className="ml-3">Status</h5>
                <div className="card mb-5">
                  <div className="p-4 space-between">
                    <h4 className="mb-0 text-muted">{GET_STATUS(this.props.user.admin).name}</h4>
                    <div className="super-center">
                      {this.props.user.admin < 1 && <h4 className="text-muted mr-3 mb-0">$0.00/mo</h4>}
                      {this.props.user.admin > 0 ? 
                        <React.Fragment>
                          {this.state.expiry ? 
                            <React.Fragment>
                              <div className="btn btn-clear disabled">Renews {this.state.expiry}</div>
                              <div className="btn btn-clear ml-2" onClick={this.toggle}><i className="fas fa-cog"/> Upgrade</div>
                            </React.Fragment> : null}
                        </React.Fragment> : 
                      <Button onClick={this.toggle} className="purple-btn">Upgrade</Button>}
                    </div>
                  </div>
                </div>
                <h5 className="ml-3">Developer Integration</h5>
                <div className="card mb-5">
                  <div className={!!this.state.profile ? "pl-4 pr-4 pt-4 space-between" : "p-4 space-between"}>
                    <h4 className="mb-0 text-muted">Amazon</h4>
                    <div className="super-center">
                      {this.renderButton(this.state.amzn, this.resetAmazon)}
                    </div>
                  </div>
                  {this.state.profile &&
                    <React.Fragment>
                      <hr/>
                      <div className="pl-4 pb-4 pr-4 space-between helper-text">
                        <div className="col-0">
                          Name:<br/>
                          Email:<br/>
                          User Id:<br/>
                        </div>
                        <div className="col-sm">
                          {this.state.profile.name}<br/>
                          {this.state.profile.email}<br/>
                          {this.state.profile.user_id}<br/>
                        </div>
                      </div>
                    </React.Fragment>
                  }
                </div>
                <div className="card mb-5">
                  <div className="p-4 space-between">
                    <h4 className="mb-0 text-muted">Google</h4>
                    <div className="super-center">
                      {this.renderButton(this.state.google, this.resetGoogle)}
                    </div>
                  </div>
                </div>
              </div>
          </div>
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setConfirm: confirm => dispatch(setConfirm(confirm))
  }
}
export default connect(null, mapDispatchToProps)(Account);
