import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormGroup, Input, Label } from 'reactstrap';

import { addIntegrationUser } from '@/ducks/integration';

import { ZAPIER } from './constants';

class FeedAddUserModal extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '' };
  }

  add = async () => {
    const { name } = this.state;
    const { onBegin, addUser, user, skill_id, onSuccess, onError } = this.props;
    try {
      onBegin();
      const newUsers = await addUser({
        user_info: { name, email: '' },
        creator_id: user.creator_id,
        skill_id,
      });
      onSuccess(newUsers);
    } catch (e) {
      console.error(e);
      let error = e;
      if (e.response && typeof e.response.data === 'string') {
        error = e.response.data;
      } else if (typeof e === 'string') {
        error = e;
      } else if (e.response) {
        error = `Error occured: ${JSON.stringify(e.response.data)}`;
      }
      onError(error);
    }
  };

  render() {
    return (
      <form
        id="feed-submit"
        onSubmit={(e) => {
          this.add();
          e.preventDefault();
          return false;
        }}
      >
        <FormGroup className="p-3 mb-0 text-center">
          <Label>Name Your Trigger</Label>
          <Input placeholder="Trigger Name" onChange={(e) => this.setState({ name: e.target.value })} className="mb-3" />
          <span className="key-bubble forward pointer" onClick={this.add}>
            <i className="far fa-long-arrow-right" />
          </span>
        </FormGroup>
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.account,
});

const mapDispatchToProps = (dispatch) => {
  return {
    addUser: (body) => dispatch(addIntegrationUser(ZAPIER, body)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedAddUserModal);
