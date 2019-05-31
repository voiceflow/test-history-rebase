import React from 'react';
import {Card, CardBody, Collapse, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";

import './ChargeTeamGroup.css';
import moment from "moment";
import ChargeItem from "../ChargeItem/ChargeItem";
import Button from "components/Button";

class ChargeTeamGroup extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      collapse: true,
      showRefundModal: false,
      showRefundCharge: null
    }
  }

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  };
  
  showRefundModal = charge => {
    console.log('showing refund modal for: ', charge);
    this.setState({
      showRefundModal: true,
      showRefundCharge: charge
    })
  };

  render() {
    if (this.props.team) {
      const {team} = this.props;
      return (
        <div className="ctg__wrapper">
          <div className="ctg__team-header">
            <span className="ctg__expand_caret" onClick={this.toggle}>
              {this.state.collapse ? <i className="fas fa-caret-down"/> : <i className="fas fa-caret-right"/>}
            </span>
            Team #{team.team_id} - Seats: {team.seats} -
            Created: {moment(team.created).format('MMMM Do YYYY, h:mm:ss a')}
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
            <ModalHeader className="am__title" toggle={this.toggle}>Modal title</ModalHeader>
            <ModalBody>
              <div>
                {/*{charges}*/}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button isWarning onClick={() => this.props.cancelSubscription(this.props.creator.creator_id)}>
                Cancel Subscription
              </Button>
              <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
          </Modal>
        </div>
      )
    } else {
      return null;
    }
  }

}

export default ChargeTeamGroup;
