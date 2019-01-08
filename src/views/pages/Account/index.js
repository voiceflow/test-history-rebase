import React, { Component } from 'react'
import AuthenticationService from './../../../services/Authentication'
import ConfirmModal from './../../components/Modals/ConfirmModal'
import {Button, Modal, ModalHeader, ModalBody, Row, Col, Alert} from 'reactstrap'
import {Elements} from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm'
import moment from 'moment'
import axios from 'axios'
import './Account.css'

const UNLINKED = 0
const LOADING = 1
const LINKED = 2

const STATUS = {
  0: {name: "Community (Free)", price: "0"},
  1: {name: "Basic", price: "29"},
  100: {name: "Admin", price: "100000000"}
}
const GET_STATUS = (status) => {
  if(status in STATUS){
    return STATUS[status]
  }else{
    return {name: 'Unknown', price: "0"}
  }
}

const options = [
  {
    plan: 1,
    name: "Basic",
    features: [
      "In Skill Purchases (Coming Soon)",
      "Voiceflow Emails",
      "Basic analytics (Coming Soon)",
      "Priority Intercom support",
      "50,000 utterances/mo"
    ]
  }
]

class Account extends Component {

  constructor(props) {
    super(props)

    this.state = {
      upgrade_modal: false,
      selected_plan: 1,
      amzn: LOADING,
      expiry: null,
      confirm: null
    };

    this.handleChange = this.handleChange.bind(this)
    this.toggle = this.toggle.bind(this)
    this.renderDescription = this.renderDescription.bind(this)
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

  renderDescription(){
    let option = options.find(o => o.plan === this.state.selected_plan)
    if(option){
      return <div>
        {option.features.map((feature, i) => <div className="feature-item" key={i}><i className="fas fa-check-circle"/>{feature}</div>)}
      </div>
    }
    return null
  }

  renderButton(stage, action){
    switch(stage){
      case LOADING:
        return <Button color="clear"><span className="loader"/></Button>
      case UNLINKED:
        return <Button color="clear" disabled>Unlinked</Button>
      default:
        return <Button onClick={action}>Reset</Button>
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
    return <div id="app">
              <ConfirmModal confirm={this.state.confirm} toggle={()=>this.setState({confirm: null})} warning/>
              <div className="subheader">
                  <div className="container space-between">
                      <span className="subheader-title">
                          <b>Account</b>
                          <div className="hr-label">
                              <small><i className="far fa-user mr-1"></i></small>{' '}
                              {this.props.user.name}{' '}
                          </div>
                      </span>
                  </div>
              </div>
              <Modal isOpen={this.state.upgrade_modal} toggle={this.toggle} size="xl">
                <ModalHeader toggle={this.toggle}>Upgrade Account</ModalHeader>
                <ModalBody>
                  <Row className="py-md-4">
                    <Col sm="3">
                      <span className="text-muted">Plan</span>
                      {options.map((option, i) => {
                        return <Button key={i}
                            disabled={this.state.selected_plan === option.plan}
                            color={this.state.selected_plan === option.plan ? undefined : "clear"}
                            block
                            className="mt-2">
                          {option.name}
                          </Button>
                      })}
                    </Col>
                    <Col sm="4" className="border-left">
                      <span className="text-muted">Description</span>
                      {this.renderDescription()}
                    </Col>
                    <Col sm="5" className="border-left">
                      <div className="text-muted">Payment</div>
                      <Elements>
                        <CheckoutForm user={this.props.user} plan={GET_STATUS(this.state.selected_plan)} selected={this.state.selected_plan} logout={this.logout}/>
                      </Elements>
                    </Col>
                  </Row>
                </ModalBody>
              </Modal>
              <div className="container my-5">
                <h5 className="ml-3">Status</h5>
                <div className="card mb-5">
                  <div className="p-4 space-between">
                    <h4 className="mb-0 text-muted">{GET_STATUS(this.props.user.admin).name}</h4>
                    <div className="super-center">
                      {this.props.user.admin < 1 && <h4 className="text-muted mr-3 mb-0">$0.00/mo</h4>}
                      {this.props.user.admin > 0 ? <React.Fragment>{this.state.expiry ? <div className="btn btn-clear disabled">Renews {this.state.expiry}</div> : null}</React.Fragment> : 
                      <Button onClick={this.toggle}>Upgrade</Button>}
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
