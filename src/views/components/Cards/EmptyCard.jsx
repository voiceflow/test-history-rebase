import React, { Component } from 'react';
import PlusThin from './../../pages/Icons/PlusThin.svg';

class EmptyCard extends Component {
  render(){
    return (
      <div className="empty-card">
        <div onClick={this.props.onClick}>
          <img src={PlusThin} style={{height: '25px'}} alt="empty card"/>
        </div>
      </div>
    )
  }
}

export default EmptyCard;
