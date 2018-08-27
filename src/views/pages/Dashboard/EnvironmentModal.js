/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';

class EnvironmentModal extends React.Component {

  render() {
    return (
      <Modal isOpen={this.props.open} toggle={this.props.toggle} centered size="lg">
        <ModalBody className="text-center env-modal">
          <h5>Select Publishing Environment</h5>
          <hr/>
          <div className="rotate cols">
            <div className="col" onTouchStart={() => this.classList.toggle('hover')}>
              <div className="container">
                <div className="front sandbox">
                  <div className="inner">
                    <img src="/images/logo_sandbox.png" alt="sandbox"/>
                  </div>
                </div>
                <div className="back">
                  <div className="inner">
                    <p>Playground for any type of content</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col" onTouchStart={() => this.classList.toggle('hover')}>
              <div className="container">
                <div className="front storyflow">
                  <div className="inner">
                    <img src="/images/logo_storyflow.png" alt="storyflow"/>
                  </div>
                </div>
                <div className="back">
                  <div className="inner">
                    <p>Professional Approved Content</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col" onTouchStart={() => this.classList.toggle('hover')}>
              <div className="container">
                <div className="front kids">
                  <div className="inner">
                    <h1>Kids</h1>
                  </div>
                </div>
                <div className="back">
                  <div className="inner">
                    <p>Kids Content</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="justify-content-center">
          <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default EnvironmentModal;