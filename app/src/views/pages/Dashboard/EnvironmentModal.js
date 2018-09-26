/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, Alert } from 'reactstrap';

import Environments from './Environments'

class EnvironmentModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        env: '',
        alert: null
    }
    this.confirm = this.confirm.bind(this);   
  }

  confirm(){
    if(this.state.env.length < 5){
      this.setState({
        alert: <Alert color="danger">
          Please Select an Environment
        </Alert>
      });
    }else{
      this.props.handleConfirm(this.state.env);
    }
  }

  render() {
    return (
      <Modal isOpen={this.props.open} toggle={this.props.toggle} centered size="lg">
        <ModalBody className="text-center env-modal">
          <h5>Where do you want to publish your story?</h5>
          <hr/>
          {this.state.alert}
          <Environments env={this.state.env} update={(type) => this.setState({env: type})}/>
        </ModalBody>
        <ModalFooter className="justify-content-center">
          <Button color="success" onClick={this.confirm}>
          Confirm
          </Button>
          <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default EnvironmentModal;