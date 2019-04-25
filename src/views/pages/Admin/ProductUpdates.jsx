import React, { Component } from 'react';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import axios from 'axios';
import { connect } from 'react-redux'

class ProductUpdates extends Component {

  constructor(props) {
      super(props)

      this.state = {
          type: 'FEATURE'
      }

      this.handleChange = this.handleChange.bind(this)
      this.createNewUpdate = this.createNewUpdate.bind(this)
  }

  handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

  createNewUpdate() {
      axios.post('/product_updates', {
          type: this.state.type,
          details: this.state.details
      })
      .then(() => {
          alert('it worked')
      })
      .catch((err) => {
          alert('it did not work')
      })
  }

  render() {
      return (
          <div className="admin-page-inner">
              <div className="subheader">
                  <div className="space-between">
                      <span className="subheader-title">
                          <b>Product Updates</b>
                          <div className="hr-label">
                              <small><i className="far fa-user mr-1"></i></small>{' '} 
                              {this.props.user.name}{' '}
                              <small><i className="far fa-chevron-right"/></small>{' '} 
                              <span className="text-secondary">Product Updates</span>
                          </div>
                      </span>
                  </div>
              </div>
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
                          <Input type="textarea" name="details" id="details" onChange={this.handleChange}></Input>
                      </FormGroup>
                  </Form>

                  <button className="btn btn-primary" onClick={this.createNewUpdate}>Create New Update</button>
              </div>
          </div>
      )
  }
}

const mapStateToProps = state => ({
  user: state.account
})

export default connect(mapStateToProps)(ProductUpdates)
