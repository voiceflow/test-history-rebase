import './PlanModal.css';

import moment from 'moment';
import React from 'react';
import DayPicker from 'react-day-picker';
import { connect } from 'react-redux';
import { Modal, ModalBody } from 'reactstrap';

import { updateWorkspace } from '@/admin/store/ducks/admin';
import Button from '@/components/Button';
import { FlexApart } from '@/components/Flex';
import { PLANS } from '@/constants';

class PlanModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.state = {
      selectedDay: undefined,
      seats: props.workspace.seats || 1,
    };
  }

  handleDayClick(day, { selected, disabled }) {
    if (disabled) {
      // Day is disabled, do nothing
      return;
    }
    if (selected) {
      // Unselect the day if already selected
      this.setState({ selectedDay: day });
      return;
    }
    this.setState({ selectedDay: day });
  }

  updatePlan = (planID) => () => {
    this.props.updateWorkspace(this.props.workspace?.team_id, { plan: planID });
  };

  updateSeats = (seats) => () => {
    this.props.updateWorkspace(this.props.workspace?.team_id, { seats });
  };

  updateExpiry = (expiry) => () => {
    this.props.updateWorkspace(this.props.workspace?.team_id, { expiry });
  };

  getSelectedDays = () => {
    if (this.props.workspace && this.props.workspace.expiry && !this.state.selectedDay) {
      return { from: new Date(), to: new Date(this.props.workspace.expiry) };
    }
    return { from: new Date(), to: this.state.selectedDay };
  };

  render() {
    const modifiersStyles = {
      selected: {
        color: '#3191FF',
        backgroundColor: '#A8D9FF',
      },
    };

    const selectedDays = this.getSelectedDays();

    const { workspace } = this.props;
    const { seats } = this.state;

    return (
      <div>
        <Modal isOpen={this.props.showPlanModal} toggle={this.props.togglePlanModal}>
          <div className="am__title" onClick={this.props.togglePlanModal}>
            Plan Controls
            <div className="close am__close" />
          </div>
          <ModalBody>
            <div>
              <div className="ctg__charge_overview">
                <div className="ctg__charge_for">Editing plan for:</div>
                <div className="ctg__charge_header">Team #{workspace.team_id}</div>
                <div className="ctg__receipt_divider"></div>
                <div className="ctg__charge_amount">
                  <div>Current Plan: {PLANS[workspace.plan]?.toUpperCase() || 'BASIC'}</div>
                  <div>Expiry: {workspace.expiry ? moment(workspace.expiry).format('MMMM Do YYYY, h:mm:ss a') : 'No expiry set'}</div>
                  <div className="ctg__date-picker">
                    <DayPicker
                      onDayClick={this.handleDayClick}
                      selectedDays={selectedDays}
                      disabledDays={{ before: new Date() }}
                      modifiersStyles={modifiersStyles}
                    />
                    <div className="ctg__trial_details">
                      <div>
                        Plan will expire{' '}
                        {moment(this.state.selectedDay)
                          .add(1, 'd')
                          .fromNow()}
                      </div>
                      <div>
                        Plan Expiry:{' '}
                        {moment(this.state.selectedDay)
                          .add(1, 'd')
                          .format('MMM Do YYYY')}{' '}
                        (expires at midnight)
                      </div>
                    </div>
                  </div>
                  <FlexApart>
                    <Button
                      variant="secondary"
                      onClick={this.updateExpiry(
                        moment(this.state.selectedDay)
                          .add(1, 'd')
                          .format()
                      )}
                    >
                      Update Expiry
                    </Button>
                    <Button variant="secondary" onClick={this.updateExpiry(null)}>
                      Cancel Expiry
                    </Button>
                  </FlexApart>
                </div>
              </div>
            </div>
            <hr />
            <div className="ctg__seats">
              Seats:
              <input
                type="number"
                id="seats"
                min="1"
                value={this.state.seats}
                onChange={(e) => this.setState({ seats: parseInt(e.target.value, 10) })}
              />
              <Button variant="secondary" onClick={this.updateSeats(seats)}>
                Update Seats
              </Button>
            </div>
            <hr />
            <label>Set Plan to: (currently {workspace.plan?.toUpperCase() || 'BASIC'})</label>
            <FlexApart>
              <Button variant="secondary" onClick={this.updatePlan(null)}>
                Basic (Free)
              </Button>
              <Button onClick={this.updatePlan(PLANS.pro)}>Pro</Button>
              <Button onClick={this.updatePlan(PLANS.team)}>Team</Button>
              <Button onClick={this.updatePlan(PLANS.enterprise)}>Enterprise</Button>
            </FlexApart>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default connect(null, { updateWorkspace })(PlanModal);
