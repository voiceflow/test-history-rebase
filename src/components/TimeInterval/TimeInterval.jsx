import 'react-day-picker/lib/style.css';

import React, { Component } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import Select from 'react-select';
import { Popover, PopoverBody } from 'reactstrap';

const yesterday = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date;
};

const options = [
  {
    label: 'Today',
    value: 'td',
  },
  {
    label: 'Yesterday',
    value: 'yd',
  },
  {
    label: 'Last 7 Days',
    value: '7d',
  },
  {
    label: 'Last 30 Days',
    value: '30d',
  },
  {
    label: 'Custom Range',
    value: 'custom',
  },
];

const getInitialState = () => ({
  from: yesterday(),
  to: new Date(),
});

class TimeInterval extends Component {
  static default_props = {
    number_of_months: 2,
  };

  constructor(props) {
    super(props);

    this.state = {
      from: yesterday(),
      to: new Date(),
      show_calendar: false,
      active: {
        value: 'td',
        label: 'Today',
      },
    };

    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.toggleCalendar = this.toggleCalendar.bind(this);
    this.getValue = this.getValue.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
  }

  handleDayClick(day) {
    const range = DateUtils.addDayToRange(day, this.state);
    this.setState(range);
    this.props.handleFilterTypeChange({ ...range });
  }

  handleResetClick() {
    this.setState(getInitialState());
  }

  toggleCalendar() {
    this.setState((prev_state) => ({
      show_calendar: !prev_state.show_calendar,
    }));
  }

  getValue = (val) => {
    if (val === 'custom') {
      return `${this.state.from.toISOString().slice(0, 10)} to ${this.state.to.toISOString().slice(0, 10)}`;
    }
    for (let i = 0; i < options.length; i++) {
      if (options[i].value === val) {
        return options[i].label;
      }
    }
  };

  updateFilter(option) {
    if (option.value === 'custom') {
      this.setState({
        active: option,
        show_calendar: true,
      });
    } else {
      this.props.handleFilterTypeChange(option.value);
      this.setState({
        active: option,
      });
    }
  }

  render() {
    const { from, to } = this.state;
    const modifiers = { start: from, end: to };
    return (
      <div className="time-interval">
        <Select
          placeholder="Filter"
          className="select-box mb-1"
          classNamePrefix="select-box"
          value={this.state.active}
          onChange={this.updateFilter}
          options={options}
          id="date-chooser"
        />
        <Popover placement="bottom" isOpen={this.state.show_calendar} target="date-chooser" toggle={this.toggleCalendar}>
          <PopoverBody>
            <DayPicker
              className="Selectable"
              numberOfMonths={this.props.numberOfMonths}
              selectedDays={[this.state.from, this.state.to]}
              modifiers={modifiers}
              onDayClick={this.handleDayClick}
              toMonth={new Date()}
            />
          </PopoverBody>
        </Popover>
      </div>
    );
  }
}

export default TimeInterval;
