import _ from 'lodash';
import React, { Component } from 'react';

export default class SearchableDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchFilter: '',
    };
  }

  onSearchChange = (e) => {
    this.setState({
      searchFilter: e.target.value,
    });
  };

  render() {
    return (
      <div className="search__dropdown">
        <div id="myDropdown" className="search__dropdown_content">
          {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
          <input type="text" placeholder="Search..." id="myInput" onChange={this.onSearchChange} onKeyUp={(e) => e.stopPropagation()} autoFocus />

          {this.state.searchFilter !== ''
            ? _.filter(this.props.options, (option) => _.includes(_.toLower(option.label), _.toLower(this.state.searchFilter))).map(this.renderOption)
            : this.props.options.map(this.renderOption)}
        </div>
      </div>
    );
  }

  renderOption = (item, idx) => (
    <div key={idx} className="dropdown_option" onClick={() => this.props.onChange(item)}>
      {item.label}
    </div>
  );
}
