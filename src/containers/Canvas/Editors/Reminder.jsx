/* eslint no-restricted-globals: ["error", "isFinite"] */
import { ContentState, convertToRaw } from 'draft-js';
import React, { Component } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate, parseDate } from 'react-day-picker/moment';
import Select from 'react-select';
import { Alert, Button, ButtonGroup } from 'reactstrap';

import VariableInput from './components/VariableInput';
import VariableText from './components/VariableText';

const FORMAT = 'DD/MM/YYYY';
const USER_TIMEZONE = 'User Timezone';

const { TIMEZONES } = require('assets/timezones');

const timezones = [{ label: USER_TIMEZONE, value: USER_TIMEZONE }, ...TIMEZONES.map((zone) => ({ label: zone.value, value: zone.value }))];

class ReminderBlock extends Component {
  constructor(props) {
    super(props);
    const default_state = {
      reminder_type: 'SCHEDULED_RELATIVE',
      time: { h: null, m: null, s: null },
      date: '',
      timezone: USER_TIMEZONE,
      freq: null,
      byDay: [],
      text: '',
      pushNotification: true,
    };

    this.state = { ...default_state, ...props.node.extras.reminder };

    if (this.state.time) {
      Object.keys(this.state.time).forEach((k) => {
        if (this.state.time[k] && typeof this.state.time[k] === 'string') {
          this.state.time[k] = convertToRaw(ContentState.createFromText(this.state.time[k]));
        }
      });
    }

    // check if default variables are initalized
    if (!this.state.time) this.state.time = default_state.time;
    if (!this.state.timezone) this.state.timezone = USER_TIMEZONE;
    const d = new Date(this.state.date);
    if (!isNaN(d)) this.state.date = d;

    this.updateContent = this.updateContent.bind(this);
  }

  componentDidUpdate() {
    const node = this.props.node;
    node.extras.reminder = this.state;
  }

  updateContent(name, content, sub) {
    if (sub) {
      const obj = this.state[name];
      obj[sub] = content;
      this.setState({
        [name]: obj,
      });
    } else {
      this.setState({
        [name]: content,
      });
    }
  }

  render() {
    const type = this.state.reminder_type;
    return (
      <div>
        <label className="mt-0">Reminder Type</label>
        <ButtonGroup className="toggle-group mb-2">
          <Button
            outline={type !== 'SCHEDULED_RELATIVE'}
            onClick={() => this.updateContent('reminder_type', 'SCHEDULED_RELATIVE')}
            disabled={type === 'SCHEDULED_RELATIVE'}
          >
            {' '}
            Timer{' '}
          </Button>
          <Button
            outline={type !== 'SCHEDULED_ABSOLUTE'}
            onClick={() => this.updateContent('reminder_type', 'SCHEDULED_ABSOLUTE')}
            disabled={type === 'SCHEDULED_ABSOLUTE'}
          >
            {' '}
            Scheduled{' '}
          </Button>
        </ButtonGroup>
        {type === 'SCHEDULED_RELATIVE' ? (
          <React.Fragment>
            <label>Time From Now</label>
          </React.Fragment>
        ) : (
          <label>Time</label>
        )}
        <div className="grid-col-3 text-muted mb-2">
          <div>Hours</div>
          <div className="px-1">Minutes</div>
          <div>Seconds</div>
          <div>
            <VariableInput
              className="form-control"
              placeholder="0"
              raw={this.state.time.h}
              updateRaw={(raw) => this.updateContent('time', raw, 'h')}
              variables={this.props.variables}
            />
          </div>
          <div className="px-1">
            <VariableInput
              className="form-control"
              placeholder="0"
              raw={this.state.time.m}
              updateRaw={(raw) => this.updateContent('time', raw, 'm')}
              variables={this.props.variables}
            />
          </div>
          <div>
            <VariableInput
              className="form-control"
              placeholder="0"
              raw={this.state.time.s}
              updateRaw={(raw) => this.updateContent('time', raw, 's')}
              variables={this.props.variables}
            />
          </div>
        </div>
        {type === 'SCHEDULED_ABSOLUTE' && (
          <React.Fragment>
            <div className="grid-col-2-skew grid-col-2 text-muted mb-2">
              <div>Date</div>
              <div>Timezone</div>
              <div className="pr-1">
                <DayPickerInput
                  formatDate={formatDate}
                  format={FORMAT}
                  parseDate={parseDate}
                  placeholder="DD/MM/YYYY"
                  dayPickerProps={{
                    disabledDays: {
                      before: new Date(),
                    },
                  }}
                  // value={this.state.date}
                  inputProps={{ className: 'form-control' }}
                  value={this.state.date}
                  onDayChange={(a, b, c) => {
                    // eslint-disable-next-line no-console
                    console.log(b);
                    if (a) {
                      this.updateContent('date', a);
                    } else {
                      setTimeout(() => {
                        this.updateContent('date', c.state.value);
                      }, 0);
                    }
                  }}
                />
              </div>
              <div>
                <Select
                  classNamePrefix="select-box"
                  value={{ value: this.state.timezone, label: this.state.timezone }}
                  onChange={(t) => this.setState({ timezone: t.value })}
                  options={timezones}
                />
              </div>
            </div>
          </React.Fragment>
        )}
        <label>Reminder</label>
        <VariableText
          className="editor"
          raw={this.state.text}
          placeholder="Walk the dog, do the dishes, etc."
          variables={this.props.variables}
          updateRaw={(raw) => this.updateContent('text', raw)}
        />
        <Alert className="mt-3">
          If failing, try prompting the user with the <b>Permission</b> block and a message
        </Alert>
      </div>
    );
  }
}

export default ReminderBlock;
