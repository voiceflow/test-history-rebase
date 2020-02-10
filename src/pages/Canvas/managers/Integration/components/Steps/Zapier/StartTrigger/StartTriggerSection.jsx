import cn from 'classnames';
import React, { Component } from 'react';

import DefaultModal from '@/components/LegacyModal/DefaultModal';
import { Spinner } from '@/components/Spinner';
import { userSelector } from '@/ducks/account';
import { deleteIntegrationUser, integrationUsersErrorSelector, integrationUsersLoadingSelector, integrationUsersSelector } from '@/ducks/integration';
import { clearModal, setConfirm, setError } from '@/ducks/modal';
import { activeSkillSelector } from '@/ducks/skill';
import { connect } from '@/hocs';

class StartTrigger extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  selectUser(user) {
    const { userChanged: propsUserChanged } = this.props;
    if (!user) return;

    const data = this.props.data;
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
    const { setConfirm, clearModal, deleteUser, skill_id, integration_user_error, setError } = this.props;
    ev.stopPropagation();

    const data = this.props.data;

    setConfirm({
      text: 'Are you sure you want to remove this trigger?',
      confirm: async () => {
        clearModal();
        const targetTrigger = {
          user,
          creator_id: data.user.creator_id,
          skill_id,
        };

        try {
          await deleteUser(data.selectedIntegration, targetTrigger);
          if (integration_user_error) {
            setError(integration_user_error);
          } else {
            if (targetTrigger.user.integration_user_id === data.user.integration_user_id) {
              this.props.onChange({
                user: {},
              });
            }
          }
        } catch (e) {
          setError(e);
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
      setError,
      integration_user_error,
      skill_id,
      integration_users_loading: props_integration_users_loading,
    } = this.props;
    const { add_user_modal, integration_users_loading } = this.state;

    const users = integration_users[this.props.data.selectedIntegration] || [];
    const user = this.props.user;

    return (
      <>
        <DefaultModal
          open={add_user_modal && !integration_users_loading}
          header="Create a New Trigger"
          toggle={this.toggleAddUserModal}
          content={
            <AddUserModal
              data={this.props.data}
              onChange={this.props.onChange}
              toggle={this.toggleAddUserModal}
              onError={(e) => setError(e)}
              onSuccess={(users) => {
                if (integration_user_error) {
                  setError(integration_user_error);
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
              skill_id={skill_id}
            />
          }
          hideFooter={true}
          noPadding={true}
        />

        <div className="d-flex align-items-center flex-column w-100 actions-section">
          {!props_integration_users_loading &&
            users &&
            users.map((e, i) => {
              return (
                <div
                  key={i}
                  className={cn('btn', 'btn-clear', 'btn-block', {
                    active: user && user.user_id === e.user_id,
                  })}
                  onClick={() => this.selectUser(e)}
                >
                  <div className="close mt-1" onClick={(ev) => this.deleteUser(ev, e)} />
                  <div className="d-flex flex-row">
                    <div className="flex-row align-self-center" />
                    <div className="text-left">
                      <b>{e.user_data && e.user_data.name}</b>
                    </div>
                  </div>
                </div>
              );
            })}
          {props_integration_users_loading && <Spinner isEmpty isLg />}
          <div className="btn btn-clear btn-lg btn-block" onClick={() => this.addUser()}>
            <span>
              <i className="far fa-plus mr-2" />
            </span>{' '}
            Create Trigger
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = {
  integration_users: integrationUsersSelector,
  integration_users_loading: integrationUsersLoadingSelector,
  integration_user_error: integrationUsersErrorSelector,
  skill_id: activeSkillSelector,
  user: userSelector,
};

const mapDispatchToProps = {
  setConfirm: (confirm) => setConfirm(confirm),
  clearModal,
  setError,
  deleteUser: (integration, data) => deleteIntegrationUser(integration, data),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StartTrigger);
