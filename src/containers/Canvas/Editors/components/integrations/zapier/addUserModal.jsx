import React, { Component } from 'react';
import { connect } from 'react-redux'
import { addIntegrationUser } from 'ducks/integration'
import {Button, InputGroup, InputGroupAddon, Input} from 'reactstrap'

import { ZAPIER } from './constants'

class FeedAddUserModal extends Component {
  constructor(props) {
    super(props);
    this.state = {name: ''};
  }

  add = async (userProfile) => {
    try {
      this.props.onBegin()
      await this.props.addUser({
        user_info: {name:this.state.name,email:''},
        creator_id: this.props.user.creator_id,
        skill_id: this.props.skill_id
      })
      this.props.onSuccess()
    } catch (e) {
      let error = e
      if (e.response && typeof e.response.data === 'string') {
        error = e.response.data
      } else if (typeof e === 'string') {
        error = e
      } else if (e.response) {
        error = `Error occured: ${JSON.stringify(e.response.data)}`
      }
      this.props.onError(error)
    }
  }

  render() {
    return (
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-center">
          <div className="text-muted text-center mt-4 mb-2 mx-5">Create a new feed</div>
        </div>
        <div className="d-flex justify-content-center mx-5 my-3">
          <InputGroup className="mb-3">
          <Input placeholder="Feed Name" onChange={(e) => this.setState({name:e.target.value})}/>
           <InputGroupAddon addonType="append">
             <Button variant="outline-secondary" onClick={this.add}>Add</Button>
           </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.account
})

const mapDispatchToProps = dispatch => {
  return {
    addUser: (body) => dispatch(addIntegrationUser(ZAPIER, body))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedAddUserModal)
