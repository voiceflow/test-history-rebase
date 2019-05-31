import React from 'react';
import { connect } from 'react-redux';
import {Alert, Card, CardBody, Collapse, Modal, ModalBody, ModalFooter} from "reactstrap";

import './ChargeTeamGroup.css';
import moment from "moment";
import ChargeItem from "../ChargeItem/ChargeItem";
import Button from "components/Button";
import '../AdminAdvancedModal/AdminAdvancedModal.css';
import Input from "components/Input";
import {refundCharge, cancelSubscription} from "ducks/admin";

class ChargeTeamGroup extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      collapse: true,
      showRefundModal: false,
      showRefundCharge: null,
      refundAmountError: '',
      refundAmount: '',
      showCancelModal: false
    }
  }

  toggle = () => {
    this.setState(prevState => ({
      showRefundModal: !prevState.showRefundModal
    }));
  };
  
  toggleSub = () => {
    this.setState(prevState => ({
      showCancelModal: !prevState.showCancelModal
    }))
  };

  toggleCharges = () => {
    this.setState(prevState => ({
      collapse: !prevState.collapse
    }))
  };
  
  showRefundModal = charge => {
    this.setState({
      showRefundModal: true,
      showRefundCharge: charge
    }, () => {
      this.setRefundAmount(parseInt(charge.amount, 10) - parseInt(charge.amount_refunded))
    })
  };
  
  setRefundAmount = amount => {
    if (!this.state.showRefundCharge)
      return;
    if (isNaN(amount)) {
      this.setState({
        refundAmountError: 'Amount must be an integer'
      })
    } else {
      if (parseInt(amount, 10) > this.state.showRefundCharge.amount) {
        this.setState({
          refundAmountError: 'Refund amount must be less than or equal to the charge amount'
        })
      } else {
        this.setState({
          refundAmount: amount
        })
      }
    }
  };

  render() {
    if (this.props.team) {
      const {team} = this.props;
      return (
        <div className="ctg__wrapper">
          <div className="ctg__team-header">
            <div className="ctg__expand_caret" onClick={this.toggleCharges}>
              {this.state.collapse ? <i className="fas fa-caret-down"/> : <i className="fas fa-caret-right"/>}
            </div>
            <div className="ctg__header-details">
              Team #{team.team_id} - Seats: {team.seats} -
              Created: {moment(team.created).format('MMMM Do YYYY, h:mm:ss a')}
              <div className="ctg__team-subheader">
                Subscription id: {team.stripe_sub_id ? team.stripe_sub_id : 'Cancelled'}
              </div>
            </div>
            {team.stripe_sub_id ? <Button className="ctg__team-cancel" isWarning onClick={this.toggleSub}>
              Cancel Subscription
            </Button> : null}
          </div>
          <Collapse isOpen={this.state.collapse}>
            <Card>
              <CardBody>
                <div className="ctg__tbl-header">
                  <table cellPadding="0" cellSpacing="0" border="0" className="ctg__table">
                    <thead>
                    <tr>
                      <th>Charge ID</th>
                      <th>Customer ID</th>
                      <th>Amount</th>
                      <th>Amount Refunded</th>
                      <th>Created</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                    </thead>
                  </table>
                </div>
                <div className="ctg__tbl-content">
                  <table cellPadding="0" cellSpacing="0" border="0" className="ctg__table">
                    <tbody>
                    {team.charges.map(charge => <ChargeItem charge={charge} key={charge.id} showModal={this.showRefundModal}/>)}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </Collapse>
          
          
          
          
          <Modal isOpen={this.state.showRefundModal} toggle={this.toggle} className={this.props.className}>
            <div className="am__title" onClick={this.toggle}>
              REFUND USER
              <div className="close am__close"></div>
            </div>
            <ModalBody>
              {this.state.showRefundCharge ? <div>
                <Alert color="danger between" className="ctg__warning">
                  <span>Are you sure you want to refund user? This action cannot be undone</span>
                  <br/>
                </Alert>
                <div className="ctg__charge_overview">
                  <div className="ctg__charge_for">
                    Charge for 
                  </div>
                  <div className="ctg__charge_header">
                    {this.state.showRefundCharge.billing_details.name} <span className="ctg__charge_header_email">{this.state.showRefundCharge.receipt_email}</span>
                  </div>
                  <div className="ctg__charge_user_id">
                    Customer ID: {this.state.showRefundCharge.customer}
                  </div>
                  <div className="ctg__charge_user_id">
                    Charge ID: {this.state.showRefundCharge.id}
                  </div>
                  <div className="ctg__charge_user_id">
                    Charge Status: {this.state.showRefundCharge.status}
                  </div>
                  <div className="ctg__charge_user_id">
                    Invoice ID: {this.state.showRefundCharge.invoice}
                  </div>
                  <div className="ctg__receipt_divider"> </div>
                  <div className="ctg__charge_amount">
                    <div>
                      Created: {moment(this.state.showRefundCharge.created).format('MMMM Do YYYY, h:mm:ss a')}
                    </div>
                    <div>
                      Total: {this.state.showRefundCharge.amount / 100} {this.state.showRefundCharge.currency}
                    </div>
                    <div>
                      Amount refunded: {this.state.showRefundCharge.amount_refunded / 100} {this.state.showRefundCharge.currency}
                    </div>
                  </div>
                  <div className="ctg__charge_description">
                    <div>
                      Receipt Number: {this.state.showRefundCharge.receipt_number}
                    </div>
                    <div>
                      Description: {this.state.showRefundCharge.description}
                    </div>
                  </div>
                </div>
                <div className="ctg__refund_amount_input">
                  Refund Amount (in cents):
                  <Input
                    className="form-control-2 ctg__refund_input"
                    placeholder="Enter the amount to refund"
                    onChange={(e) => this.setRefundAmount(e.target.value)}
                    value={this.state.refundAmount}
                    type="text"
                  />
                </div>
              </div> : null}
            </ModalBody>
            <ModalFooter>
              <Button isWarning onClick={() => this.props.refundCharge(team.team_id, this.state.showRefundCharge.id, this.state.refundAmount)}>
                Refund User
              </Button>
              <Button isSecondary onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
          </Modal>



          <Modal isOpen={this.state.showCancelModal} toggle={this.toggleSub} className={this.props.className}>
            <div className="am__title" onClick={this.toggleSub}>
              CANCEL SUBSCRIPTION
              <div className="close am__close"></div>
            </div>
            <ModalBody>
              <div>
                <Alert color="danger between" className="ctg__warning">
                  <span>Are you sure you want to cancel this team? This action cannot be undone</span>
                  <br/>
                </Alert>
                <div className="ctg__charge_overview">
                  <div className="ctg__charge_for">
                    Subscription for
                  </div>
                  <div className="ctg__charge_header">
                    Team #{team.team_id}
                  </div>
                  <div className="ctg__receipt_divider"> </div>
                  <div className="ctg__charge_amount">
                    <div>
                      Subscription started: {moment(team.created).format('MMMM Do YYYY, h:mm:ss a')}
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button isWarning onClick={() => this.props.cancelSubscription(team.team_id, team.stripe_sub_id)}>
                Cancel Subscription
              </Button>
              <Button isSecondary onClick={this.toggleSub}>Cancel</Button>
            </ModalFooter>
          </Modal>
          
          
          
          
        </div>
      )
    } else {
      return (
        <div>
          Loading... Is it possible this team doesn't have any charges?
        </div>
      );
    }
  }

}

export default connect(null, { refundCharge, cancelSubscription })(ChargeTeamGroup);
