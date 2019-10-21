import React, { Component } from 'react';
import { FormGroup, Input, Label } from 'reactstrap';

import { userSelector } from '@/ducks/account';
import { addIntegrationUser } from '@/ducks/integration';
import { connect } from '@/hocs/connect';

class FeedAddUserModal extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '' };
  }

  add = async () => {
    const { name } = this.state;
    const { onBegin, addUser, skill_id, onSuccess, onError } = this.props;
    const user = this.props.data.user;

    try {
      onBegin();
      const newUserMeta = {
        user_info: { name, email: '' },
        creator_id: user.creator_id,
        skill_id,
      };
      const users = await addUser(newUserMeta);
      onSuccess(users);
    } catch (e) {
      onError(e);
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

const mapStateToProps = {
  user: userSelector,
};

const mapDispatchToProps = {
  addUser: (body) => addIntegrationUser('Zapier', body),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedAddUserModal);
