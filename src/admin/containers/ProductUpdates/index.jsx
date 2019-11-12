import axios from 'axios/index';
import Markdown from 'markdown-to-jsx';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Input, Label } from 'reactstrap';

import { AdminTitle } from '@/admin/styles';
import Button from '@/components/Button';
import { toast } from '@/componentsV2/Toast';

class ProductUpdates extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: 'FEATURE',
    };

    this.handleChange = this.handleChange.bind(this);
    this.createNewUpdate = this.createNewUpdate.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  createNewUpdate() {
    axios
      .post('/product_updates', {
        type: this.state.type,
        details: this.state.details,
      })
      .then(() => {
        toast.success('Product update successfully added');
      })
      .catch(() => {
        toast.error('Fields not Complete!');
      });
  }

  render() {
    return (
      <>
        <AdminTitle>Product Updates</AdminTitle>
        <hr />

        <div className="content">
          <h5>Create a new update</h5>
          <Form>
            <FormGroup>
              <Label for="type">What type of update is it</Label>
              <Input type="select" name="type" id="type" onChange={this.handleChange}>
                <option>FEATURE</option>
                <option>UPDATE</option>
                <option>CHANGE</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="details">Enter your update here</Label>
              <Input
                type="textarea"
                name="details"
                id="details"
                placeholder="Checkout new **features** of [Voiceflow Creator](https://creator.voiceflow.com)"
                onChange={this.handleChange}
                maxLength={150}
              />
            </FormGroup>
          </Form>

          <div className="sample">
            <h6>Sample update:</h6>
            <hr />
            <div className="wrapper">
              <span>Input: </span>
              <p className="code">Checkout new **features** of [Voiceflow Creator](https://creator.voiceflow.com)</p>
            </div>
            <div className="wrapper">
              <span>Output: </span>
              <p className="code">
                <Markdown>Checkout new **features** of [Voiceflow Creator](https://creator.voiceflow.com)</Markdown>
              </p>
            </div>
            <p>
              Can also use - {/* eslint-disable-next-line react/jsx-no-target-blank */}
              <a href="https://stackedit.io/app#" target="_blank">
                Slack Markdown editor
              </a>{' '}
              (third-party)
            </p>
          </div>

          <Button isBtn isPrimary onClick={this.createNewUpdate}>
            Create New Update
          </Button>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.account,
});

export default connect(mapStateToProps)(ProductUpdates);
