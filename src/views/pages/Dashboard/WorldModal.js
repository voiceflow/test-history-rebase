/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import axios from 'axios';
import { Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Form } from 'reactstrap';

import Environments from './Environments'

class ModalExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      platform: '',
      name: '',
      alert: null
    };

    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleChange (evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    if(this.state.platform.length < 5){
      this.setState({
        alert: <Alert color="danger">
          Please Select an Environment
        </Alert>
      })
      return false;
    }

    let that = this;
    axios.post('/world', {
      name: this.state.name,
      env: this.state.platform
    })
    .then(function (response) {
      that.props.update();
      that.setState({
        name: '',
        platform: '',
        alert: null,
        modal: false,
      });
    })
    .catch(function (error) {
      console.log(error);
      that.setState({
        alert: <Alert color="danger">
          Something went wrong
        </Alert>
      })
    })
    return false;
  }

  render() {
    return (
      <div>
        <Button color="primary" onClick={this.toggle}>Create New World</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} size='lg'>
          <ModalHeader toggle={this.toggle}>Create New World</ModalHeader>
          <Form onSubmit={this.handleSubmit}>
            <ModalBody>
              {this.state.alert}
              <FormGroup>
                <Label>World Name</Label>
                <Input type="text" name="name" placeholder="World Name" required value={this.state.name} onChange={this.handleChange}/>
              </FormGroup>
              <FormGroup>
                <Label>Environment</Label>
                <Environments env={this.state.platform} update={(type) => this.setState({platform: type})} noedge/>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">Submit</Button>
              <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default ModalExample;