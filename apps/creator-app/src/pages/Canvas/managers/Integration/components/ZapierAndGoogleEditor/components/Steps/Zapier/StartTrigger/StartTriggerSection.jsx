import { Button, Modal, Spinner, SvgIcon } from '@voiceflow/ui';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as Account from '@/ducks/account';
import * as Integration from '@/ducks/integration';
import * as Session from '@/ducks/session';
import * as ModalsV2 from '@/ModalsV2';

class StartTrigger extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  selectUser(user) {
    const { userChanged: propsUserChanged } = this.props;
    if (!user) return;

    const { data } = this.props;
    const userChanged = user.user_id !== (data.user && data.user.user_id);
    this.props.onChange({
      user,
    });

    this.setState({
      completed: true,
    });
    if (propsUserChanged && userChanged) {
      propsUserChanged();
    }
    this.props.openNextStep();
  }

  deleteUser(ev, user) {
    const { deleteUser, versionID, integration_user_error } = this.props;
    ev.stopPropagation();

    const { data } = this.props;

    ModalsV2.openConfirm({
      body: 'Are you sure you want to remove this trigger?',
      header: 'Remove Trigger',
      confirmButtonText: 'Remove',

      confirm: async () => {
        const targetTrigger = {
          user,
          creator_id: data.user.creator_id,
          skill_id: versionID,
        };

        try {
          await deleteUser(data.selectedIntegration, targetTrigger);

          if (integration_user_error) {
            ModalsV2.openError({ error: integration_user_error });
          } else if (targetTrigger.user.integration_user_id === data.user.integration_user_id) {
            this.props.onChange({ user: {} });
          }
        } catch (e) {
          ModalsV2.openError({ error: e });
        }
      },
    });
  }

  addUser = () => this.setState({ add_user_modal: true });

  toggleAddUserModal = () => this.setState({ add_user_modal: !this.state.add_user_modal });

  render() {
    const {
      user_modal: AddUserModal,
      integration_users,
      integration_user_error,
      versionID,
      integration_users_loading: props_integration_users_loading,
    } = this.props;
    const { add_user_modal, integration_users_loading } = this.state;

    const users = integration_users[this.props.data.selectedIntegration] || [];
    const { user } = this.props;

    return (
      <>
        {add_user_modal && !integration_users_loading && (
          <>
            <Modal.Backdrop onClick={this.toggleAddUserModal} />

            <Modal opened>
              <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={this.toggleAddUserModal} />}>Create a New Trigger</Modal.Header>

              <Modal.Body>
                <AddUserModal
                  data={this.props.data}
                  onChange={this.props.onChange}
                  toggle={this.toggleAddUserModal}
                  onError={(e) => ModalsV2.openError({ error: e })}
                  onSuccess={(users) => {
                    if (integration_user_error) {
                      ModalsV2.openError({ error: integration_user_error });
                      return;
                    }
                    const zapierUsers = users.Zapier;
                    this.props.onChange({ user: zapierUsers[zapierUsers.length - 1] });

                    this.setState({
                      add_user_modal: false,
                      completed: true,
                    });
                  }}
                  onBegin={() =>
                    this.setState({
                      add_user_modal: false,
                    })
                  }
                  skill_id={versionID}
                />
              </Modal.Body>
            </Modal>
          </>
        )}

        <div className="d-flex align-items-center flex-column w-100 actions-section">
          {!props_integration_users_loading &&
            users &&
            users.map((e, i) => (
              <Button key={i} variant={Button.Variant.SECONDARY} onClick={() => this.selectUser(e)} isActive={user?.user_id === e.user_id}>
                <SvgIcon mt={1} icon="close" clickable onClick={(ev) => this.deleteUser(ev, e)} />
                <div className="d-flex flex-row">
                  <div className="flex-row align-self-center" />
                  <div className="text-left">
                    <b>{e.user_data && e.user_data.name}</b>
                  </div>
                </div>
              </Button>
            ))}
          {props_integration_users_loading && <Spinner isEmpty />}
          <Button variant={Button.Variant.SECONDARY} onClick={() => this.addUser()}>
            Create Trigger
          </Button>
        </div>
      </>
    );
  }
}

const mapStateToProps = {
  integration_users: Integration.integrationUsersSelector,
  integration_users_loading: Integration.integrationUsersLoadingSelector,
  integration_user_error: Integration.integrationUsersErrorSelector,
  versionID: Session.activeVersionIDSelector,
  user: Account.userSelector,
};

const mapDispatchToProps = {
  deleteUser: Integration.deleteIntegrationUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(StartTrigger);
