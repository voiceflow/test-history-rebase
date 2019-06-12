import React, { Component } from 'react';

class EmptyCard extends Component {
  render() {
    return (
      <div className="empty-card">
        <div onClick={this.props.onClick}>
          <img src="/add-step.svg" style={{ height: '25px' }} alt="empty card" />
        </div>
      </div>
    );
  }
}

export default EmptyCard;
