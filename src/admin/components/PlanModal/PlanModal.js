import './PlanModal.css';

import moment from 'moment';
import React from 'react';
import DayPicker from 'react-day-picker';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';

import Button from '@/components/Button';
import { editTrial, setEnterprise } from '@/ducks/admin';

class PlanModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.state = {
      selectedDay: undefined,
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

  giveTrial = (expiry) => {
    if (!expiry && expiry !== null) {
      toast.error('You must select a day for the trial');
      return;
    }
    if (!expiry && !this.props.team.expiry) {
      toast.error('User already has no trial');
      return;
    }
    if (this.props.team) {
      this.props.editTrial(this.props.team.team_id, expiry);
    } else {
      toast.error('Team not found.');
    }
    this.props.togglePlanModal();
  };

  makeEnterprise = (expiry, planId) => {
    if (!expiry && expiry !== null) {
      toast.error('You must select a day for the trial');
      return;
    }
    if (!expiry && !this.props.team.expiry) {
      toast.error('User already has no trial');
      return;
    }
    if (this.props.team) {
      this.props.setEnterprise(this.props.team.team_id, planId, expiry);
    } else {
      toast.error('Team not found.');
    }
    this.props.togglePlanModal();
  };

  getSelectedDays = () => {
    if (this.props.team && this.props.team.expiry && !this.state.selectedDay) {
      return { from: new Date(), to: new Date(this.props.team.expiry) };
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

    const { team } = this.props;

    let planType;

    switch (team.plan_id) {
      case 0:
        planType = 'Community';
        break;
      case 1:
        planType = 'Pro';
        break;
      case 2:
        planType = 'Business';
        break;
      default:
        planType = `Unknown: ${team.plan_id}`;
        break;
    }

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
                <div className="ctg__charge_header">Team #{team.team_id}</div>
                <div className="ctg__receipt_divider"></div>
                <div className="ctg__charge_amount">
                  <div>Current Plan: {planType}</div>
                  <div>Expiry: {team.expiry ? moment(team.expiry).format('MMMM Do YYYY, h:mm:ss a') : 'No expiry set'}</div>
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
                          .startOf('day')
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
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter style={{ 'justify-content': 'center' }}>
            <Button
              isWarning
              onClick={() => {
                this.giveTrial(null);
              }}
            >
              Change to free
            </Button>
            <Button
              isPrimary
              onClick={() => {
                this.giveTrial(this.state.selectedDay);
              }}
            >
              Set Trial
            </Button>
          </ModalFooter>
          <ModalFooter style={{ 'justify-content': 'center' }}>
            <Button
              isPrimary
              onClick={() => {
                this.makeEnterprise(this.state.selectedDay, 1);
              }}
            >
              Set Enterprise Pro
            </Button>
            <Button
              isPrimary
              onClick={() => {
                this.makeEnterprise(this.state.selectedDay, 2);
              }}
            >
              Set Enterprise Business
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default connect(
  null,
  { editTrial, setEnterprise }
)(PlanModal);
