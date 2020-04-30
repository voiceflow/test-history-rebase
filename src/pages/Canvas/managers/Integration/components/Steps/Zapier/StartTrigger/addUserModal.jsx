import React, { Component } from 'react';
import { Input } from 'reactstrap';

import Button from '@/components/Button';
import { FlexCenter } from '@/components/Flex';
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
        className="mx-4 mb-4"
        onSubmit={(e) => {
          this.add();
          e.preventDefault();
          return false;
        }}
      >
        <Input placeholder="Trigger Name" onChange={(e) => this.setState({ name: e.target.value })} className="mb-3" />
        <FlexCenter>
          <Button onClick={this.add}>Save Trigger</Button>
        </FlexCenter>
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

export default connect(mapStateToProps, mapDispatchToProps)(FeedAddUserModal);
