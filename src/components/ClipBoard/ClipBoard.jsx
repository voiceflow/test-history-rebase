import React, { Component } from 'react';
import { Tooltip } from 'reactstrap';

import Clipboard from './ClipBoardSource';

class ClipBoard extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.state = {
      tooltipOpen: false,
      copied: false,
    };
  }

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
      copied: false,
    });
  }

  onSuccess() {
    this.setState({
      tooltipOpen: true,
      copied: true,
    });
  }

  render() {
    return (
      <>
        <Clipboard
          id={this.props.id}
          style={{ cursor: 'pointer' }}
          data-clipboard-text={this.props.value}
          onSuccess={this.onSuccess}
          component={this.props.component}
          className={this.props.className}
        >
          {this.props.children}
        </Clipboard>
        <Tooltip placement="bottom" isOpen={this.state.tooltipOpen} target={this.props.id} toggle={this.toggle}>
          {this.state.copied ? 'Copied!' : 'Copy to Clipboard'}
        </Tooltip>
      </>
    );
  }
}

export default ClipBoard;
