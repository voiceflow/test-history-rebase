import './TrialModal.css';

import moment from 'moment';
import React from 'react';
import DayPicker from 'react-day-picker';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';

import Button from '@/components/Button';
import { editTrial } from '@/ducks/admin';

class TrialModal extends React.Component {
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

  giveTrial = (trialLength) => {
    if (!trialLength && trialLength !== null) {
      toast.error('You must select a day for the trial');
      return;
    }
    if (!trialLength && !this.props.team.expiry) {
      toast.error('User already has no trial');
      return;
    }
    if (this.props.team) {
      this.props.editTrial(this.props.team.team_id, trialLength);
    } else {
      toast.error('Team not found.');
    }
    this.props.toggleTrial();
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
    return (
      <div>
        <Modal isOpen={this.props.showTrialModal} toggle={this.props.toggleTrial}>
          <div className="am__title" onClick={this.props.toggleTrial}>
            Trial controls
            <div className="close am__close" />
          </div>
          <ModalBody>
            <div>
              <div className="ctg__charge_overview">
                <div className="ctg__charge_for">Editing trial for:</div>
                <div className="ctg__charge_header">Team #{team.team_id}</div>
                <div className="ctg__receipt_divider"> </div>
                <div className="ctg__charge_amount">
                  <div>Current trial status: {team.expiry ? moment(team.expiry).format('MMMM Do YYYY, h:mm:ss a') : 'No trial set'}</div>
                  <div className="ctg__date-picker">
                    <DayPicker
                      onDayClick={this.handleDayClick}
                      selectedDays={selectedDays}
                      disabledDays={{ before: new Date() }}
                      modifiersStyles={modifiersStyles}
                    />
                    <div className="ctg__trial_details">
                      <div>
                        Trial will expire{' '}
                        {moment(this.state.selectedDay)
                          .startOf('day')
                          .fromNow()}
                      </div>
                      <div>
                        Trial Expiry:{' '}
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
          <ModalFooter>
            <Button isSecondary onClick={this.props.toggleTrial}>
              Cancel
            </Button>
            <Button
              isWarning
              onClick={() => {
                this.giveTrial(null);
              }}
            >
              Change to free plan
            </Button>
            <Button
              isPrimary
              onClick={() => {
                this.giveTrial(this.state.selectedDay);
              }}
            >
              Grant Trial
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default connect(
  null,
  { editTrial }
)(TrialModal);
