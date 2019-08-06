import cn from 'classnames';
import update from 'immutability-helper';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Collapse } from 'reactstrap';

import DefaultModal from '@/components/Modals/DefaultModal';
import { Spinner } from '@/components/Spinner';
import { deleteIntegrationUser } from '@/ducks/integration';
import { clearModal, setConfirm, setError } from '@/ducks/modal';

// props
// selected_integration, user, integration_data, updateIntegrationData, showNextSection, user_modal, action_data, toggleSection, open

class FeedSection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.checkCompletion();
  }

  componentDidUpdate() {
    this.checkCompletion();
  }

  checkCompletion() {
    const { integrationsUser, integration_users: integrationUsers, selected_integration: selectedIntegration } = this.props;
    const { completed: stateCompleted } = this.state;
    let completed = false;

    if (!integrationsUser && selectedIntegration && integrationUsers[selectedIntegration] && integrationUsers[selectedIntegration].length) {
      const users = integrationUsers[selectedIntegration];
      this.selectUser(users[users.length - 1]);
      completed = true;
    }

    if (integrationsUser) {
      completed = true;
    }

    if (completed !== stateCompleted) {
      this.setState({
        completed,
      });
    }
  }

  selectUser(user) {
    const { integration_data, userChanged: propsUserChanged, updateIntegrationData, showNextSection } = this.props;
    if (!user) return;

    const userChanged = user.user_id !== (integration_data.user && integration_data.user.user_id);
    const newIntegrationData = update(integration_data, {
      user: {
        $set: user,
      },
    });

    this.setState({
      completed: true,
    });
    if (propsUserChanged && userChanged) {
      updateIntegrationData(newIntegrationData, () => propsUserChanged());
    } else {
      updateIntegrationData(newIntegrationData);
    }
    showNextSection();
  }

  deleteUser(ev, user) {
    const {
      setConfirm,
      clearModal,
      deleteUser,
      selected_integration,
      user: propsUser,
      skill_id,
      integration_user_error,
      setError,
      integration_data,
      updateIntegrationData,
    } = this.props;
    // TODO: fix
    ev.stopPropagation();

    setConfirm({
      text: 'Are you sure you want to remove this trigger?',
      confirm: async () => {
        clearModal();

        try {
          await deleteUser(selected_integration, {
            user,
            creator_id: propsUser.creator_id,
            skill_id,
          });
          if (integration_user_error) {
            setError(integration_user_error);
          } else {
            setConfirm({
              text: 'Trigger deleted successfully.',
              confirm: () => {
                clearModal();
                this.forceUpdate();
              },
            });
            const newIntegrationData = update(integration_data, {
              user: {
                $set: null,
              },
            });
            updateIntegrationData(newIntegrationData, () => {
              this.forceUpdate();
              this.checkCompletion();
            });
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
      integrationsUser: user,
      user_modal: AddUserModal,
      selected_integration,
      integration_users,
      action_data,
      setError,
      integration_user_error,
      updateIntegrationData,
      skill_id,
      toggleSection,
      open,
      integration_data,
      integration_users_loading: props_integration_users_loading,
    } = this.props;
    const { add_user_modal, integration_users_loading, completed } = this.state;

    const users = integration_users[selected_integration] || [];

    if (!action_data) {
      return null;
    }

    return (
      <>
        <DefaultModal
          open={add_user_modal && !integration_users_loading}
          header="Create a New Trigger"
          toggle={this.toggleAddUserModal}
          content={
            <AddUserModal
              toggle={this.toggleAddUserModal}
              onError={(e) => setError(e)}
              onSuccess={() => {
                if (integration_user_error) {
                  setError(integration_user_error);
                  return;
                }

                const newIntegrationData = update(integration_data, {
                  user: {
                    $set: users[users.length - 1],
                  },
                });

                updateIntegrationData(newIntegrationData);
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
        <div className="d-flex flex-column section-title-container" onClick={() => toggleSection()}>
          <div className="integrations-section-title text-muted">
            Start Trigger
            <span
              className={cn('action-selected', {
                'action-visible': _.get(user, ['user_data', 'name']),
              })}
              onClick={() => toggleSection()}
            >
              {_.get(user, ['user_data', 'name'])}
            </span>
            {completed && <div className="completed-badge">&nbsp;&nbsp;&nbsp;&nbsp;</div>}
          </div>
        </div>
        <Collapse isOpen={open} className="w-100">
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
        </Collapse>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  integration_users: state.integrationUsers.integration_users,
  integration_users_loading: state.integrationUsers.loading,
  integration_user_error: state.integrationUsers.error,
  skill_id: state.skills.skill.skill_id,
  user: state.account,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setConfirm: (confirm) => dispatch(setConfirm(confirm)),
    clearModal: () => dispatch(clearModal()),
    setError: (error) => dispatch(setError(error)),
    deleteUser: (integration, data) => dispatch(deleteIntegrationUser(integration, data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedSection);
