/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import './Modals.css'

class MultiPlatformModalContent extends React.Component {

  render() {
    return (
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-center">
          <div className="text-muted text-center my-5 mx-5">Building for both platforms simultaneously is a premium feature, please upgrade to proceed</div>
        </div>
        <div className="d-flex justify-content-center img-container">
        <img className="platform-modal-img" src="/alexa.png" alt="empty" />
        <img className="platform-modal-img" src="/google_home.png" alt="empty" />
        </div>
        <div className="d-flex justify-content-end py-4" style={{backgroundColor : "#eff2f8", borderRadius : "0 0 10px 10px", borderTop: '1px solid 1px solid rgba(141, 162, 181, .28)'}}>
          <button className="mr-4 btn-tertiary" onClick={this.props.toggle}>Close</button>
          <button type="button" className="btn-primary mr-4" onClick={() => {this.props.history.push('/account/upgrade')}}>Upgrade</button>
        </div>
      </div>
    );
  }
}

export default MultiPlatformModalContent;