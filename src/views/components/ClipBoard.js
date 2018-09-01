import React, { Component } from 'react';
import Clipboard from 'react-clipboard.js';
import { Tooltip } from 'reactstrap';

class ClipBoard extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.state = {
      tooltipOpen: false
    };
  }

  toggle() {
    this.setState({
      tooltipOpen: false
    });
  }

  onSuccess() {
    this.setState({
    	tooltipOpen: true
    })
  }

  render() {
    return (
      <div id={this.props.id} style={{cursor: "pointer"}}>
      	<Clipboard data-clipboard-text={this.props.value} onSuccess={this.onSuccess} component="p" className="mb-0">
	        {this.props.value}
      	</Clipboard>
        <Tooltip placement="left" isOpen={this.state.tooltipOpen} target={this.props.id} toggle={this.toggle}>
          Copied!
        </Tooltip>
      </div>
    );
  }
}

export default ClipBoard;