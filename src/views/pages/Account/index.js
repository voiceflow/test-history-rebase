import React, { Component } from 'react'
import {Button, Modal, ModalHeader, ModalBody, Row, Col} from 'reactstrap'
import {Elements} from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm'
import './Account.css'

const STATUS = {
  0: {name: "Community (Free)", price: "0"},
  1: {name: "Basic", price: "29"},
  10: {name: "Admin", price: "100000000"}
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
      selected_plan: 1
    }

    this.handleChange = this.handleChange.bind(this)
    this.toggle = this.toggle.bind(this)
    this.renderDescription = this.renderDescription.bind(this)
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

  render() {
    return <div className='Window'>
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
                        <CheckoutForm user={this.props.user} plan={STATUS[this.state.selected_plan]} selected={this.state.selected_plan}/>
                      </Elements>
                    </Col>
                  </Row>
                </ModalBody>
              </Modal>
              <div className="container my-5 pt-5">
                <h5 className="ml-3">Status</h5>
                <div className="card">
                  <div className="p-4 space-between">
                    <h4 className="mb-0 text-muted">{STATUS[this.props.user.admin].name}</h4>
                    <div className="super-center">
                      {this.props.user.admin === 0 && <h4 className="text-muted mr-3 mb-0">$0.00/mo</h4>}
                      <Button onClick={this.toggle}>Upgrade</Button>
                    </div>
                  </div>
                </div>
              </div>
          </div>
  }
}

export default Account;
