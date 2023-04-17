import { Button, FlexCenter, Input } from '@voiceflow/ui';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as Account from '@/ducks/account';
import * as Integration from '@/ducks/integration';

class FeedAddUserModal extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '' };
  }

  add = async () => {
    const { name } = this.state;
    const { onBegin, addUser, skill_id, onSuccess, onError } = this.props;
    const { user } = this.props.data;

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
        <Input placeholder="Trigger Name" onChangeText={(value) => this.setState({ name: value })} className="mb-3" />

        <FlexCenter>
          <Button>Save Trigger</Button>
        </FlexCenter>
      </form>
    );
  }
}

const mapStateToProps = {
  user: Account.userSelector,
};

const mapDispatchToProps = {
  addUser: (body) => Integration.addIntegrationUser('Zapier', body),
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedAddUserModal);
