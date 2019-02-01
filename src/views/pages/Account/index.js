import React, { Component } from 'react'
import AuthenticationService from './../../../services/Authentication'
import ConfirmModal from './../../components/Modals/ConfirmModal'
import UpgradeModal from './../../components/Modals/UpgradeModal'
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
      upgrade_modal: false,
      amzn: LOADING,
      expiry: null,
      confirm: null
    };

    this.handleChange = this.handleChange.bind(this)
    this.toggle = this.toggle.bind(this)
    this.resetAmazon = this.resetAmazon.bind(this)
    this.logout = this.logout.bind(this)
  }

  resetAmazon() {
    this.setState({
      confirm: {
        text: <Alert color="danger" className="mb-0">
          <i className="fas fa-exclamation-triangle fa-2x"/><br/>
          Resetting your Amazon Account is dangerous and will de-sync all your published projects. Do not reset unless you know what you are doing
        </Alert>,
        confirm: () => {
          this.setState({confirm: null, amzn: LOADING}, () => {
            axios.delete('/session/amazon').then(()=>{
              this.setState({amzn: UNLINKED})
            })
            .catch(err => {
              this.setState({amzn: LINKED})
              alert('Failed to Delete Amazon Account Association =')
            })
          })
        }
      }
    })
  }

  componentDidMount() {
      AuthenticationService.AmazonAccessToken(token => {
          this.setState({
              amzn: !!token ? LINKED : UNLINKED
          });
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
    this.setState({
      upgrade_modal: !this.state.upgrade_modal
    });
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
              <ConfirmModal confirm={this.state.confirm} toggle={()=>this.setState({confirm: null})} warning/>
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
                upgrade_modal={this.state.upgrade_modal}
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
                      {this.props.user.admin > 0 ? <React.Fragment>{this.state.expiry ? <div className="btn btn-clear disabled">Renews {this.state.expiry}</div> : null}</React.Fragment> : 
                      <Button onClick={this.toggle} className="purple-btn">Upgrade</Button>}
                    </div>
                  </div>
                </div>
                <h5 className="ml-3">Developer Integration</h5>
                <div className="card mb-5">
                  <div className="p-4 space-between">
                    <h4 className="mb-0 text-muted">Amazon</h4>
                    <div className="super-center">
                      {this.renderButton(this.state.amzn, this.resetAmazon)}
                    </div>
                  </div>
                </div>
              </div>
          </div>
  }
}

export default Account;
