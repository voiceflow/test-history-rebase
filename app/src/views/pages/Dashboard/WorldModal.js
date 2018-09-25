/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Form } from 'reactstrap';

import AuthenticationService from './../../../services/Authentication';

class ModalExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      user: AuthenticationService.getUser()
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      user: AuthenticationService.getUser(),
      modal: !this.state.modal
    });
  }

  render() {
    return (
      <div>
        <Button color="danger" onClick={this.toggle}>Create New World</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Create New World</ModalHeader>
          <Form>
            <ModalBody>
              <FormGroup>
                <Label>World Name</Label>
                <Input type="text" name="name" placeholder="World Name" required/>
              </FormGroup>
              <FormGroup>
                <Label for="exampleSelect">Platform</Label>
                <Input type="select" name="platform" required>
                  <option>production</option>
                  {this.state.user.admin ? <option>staging</option> : null}
                  <option>storyflow kids</option>
                  <option>sandbox</option>
                </Input>
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