import React, { Component } from 'react';
import { connect } from 'react-redux'
import { addIntegrationUser } from 'ducks/integration'
import { Input,Label, FormGroup } from 'reactstrap'

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
      <form id="feed-submit" onSubmit={(e)=>{this.add(); e.preventDefault(); return false;}}>
      <FormGroup className="p-3 mb-0 text-center">
        <Label>Name Your Trigger</Label>
        <Input placeholder="Trigger Name" onChange={(e) => this.setState({name:e.target.value})} className="mb-3"/>
        <span className="key-bubble forward pointer" onClick={this.add}><i className="far fa-long-arrow-right"/></span>
      </FormGroup>
      </form>
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
