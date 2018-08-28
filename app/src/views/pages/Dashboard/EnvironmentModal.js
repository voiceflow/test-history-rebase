/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';

class EnvironmentModal extends React.Component {

  constructor(props) {
        super(props);

        this.state = {
            sandbox: false,
            storyflow: false,
            kids: false
        }

        this.toggle = this.toggle.bind(this);
  }

  toggle(type){
    this.setState({
      [type]: !this.state[type]
    });
  }

  render() {
    return (
      <Modal isOpen={this.props.open} toggle={this.props.toggle} centered size="lg">
        <ModalBody className="text-center env-modal">
          <h5>Where do you want to publish your story?</h5>
          <hr/>
          <div className="rotate cols">
            <div className="col" onTouchStart={() => this.classList.toggle('hover')}>
              <div onClick={() => this.toggle("sandbox")} className={"container" + (this.state.sandbox ? " selected" : "")}>
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
              <div onClick={() => this.toggle("storyflow")} className={"container" + (this.state.storyflow ? " selected" : "")}>
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
              <div className={"container" + (this.state.kids ? " selected" : "")}>
                <div className="front kids">
                  <div className="inner">
                    <h3><u>Coming Soon</u></h3>
                  </div>
                </div>
                <div className="back">
                  <div className="inner">
                    <p>Content for children and family</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="justify-content-center">
          <Button color="success" onClick={() => {
            let list = []
            if(this.state.storyflow) list.push('storyflow');
            if(this.state.sandbox) list.push('sandbox');
            if(this.state.kids) list.push('kids');
            this.props.handleConfirm(list)}
          }>
          Confirm
          </Button>
          <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default EnvironmentModal;