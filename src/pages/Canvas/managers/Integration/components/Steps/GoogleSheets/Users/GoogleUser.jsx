import cn from 'classnames';
import _ from 'lodash';
import React from 'react';

import DefaultModal from '@/components/LegacyModal/DefaultModal';
import { Spinner } from '@/components/Spinner';
import { INTEGRATION_DATA_MODELS } from '@/constants';
import { userSelector } from '@/ducks/account';
import { deleteIntegrationUser, integrationUsersErrorSelector, integrationUsersLoadingSelector, integrationUsersSelector } from '@/ducks/integration';
import { clearModal, setConfirm, setError } from '@/ducks/modal';
import { activeSkillIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { useToggle } from '@/hooks/toggle';

import SquareButton from '../../components/SquareButton';
import DropdownHeader from '../../components/StepDropdown';
import AddGoogleUserModal from './AddGoogleUserModal';

function AddGoogleUser({
  data,
  onChange,
  isOpened,
  openNextStep,
  toggle,
  integration_users,
  setError,
  integration_user_error,
  setConfirm,
  deleteUser: deleteIntUser,
  skill_id,
}) {
  const [addUserModalOpened, toggleAddUserModal] = useToggle(false);
  const [deletingUser, setDeletingUser] = React.useState(false);

  const { user } = data;

  const addGoogleUser = () => {
    toggleAddUserModal();
  };

  const selectUser = (user) => {
    if (!user) return;

    if (user !== data.user) {
      // Reset all data except selected Action and set user
      onChange({ ...INTEGRATION_DATA_MODELS.GOOGLE_SHEETS, user, selectedAction: data.selectedAction });
      openNextStep();
    }
  };

  const deleteUser = (ev, targetUser) => {
    setConfirm({
      text: 'Are you sure you want to remove this user?',
      confirm: async () => {
        clearModal();
        try {
          setDeletingUser(true);
          await deleteIntUser('Google Sheets', {
            user: targetUser,
            creator_id: targetUser.creator_id,
            skill_id,
          });
          setDeletingUser(false);

          if (integration_user_error) {
            setError(integration_user_error);
          } else {
            if (targetUser.user_data?.email === data?.user?.user_data?.email) {
              onChange({ user: {} });
              onChange({ ...INTEGRATION_DATA_MODELS.GOOGLE_SHEETS, selectedAction: data.selectedAction });
            } else {
              onChange({ ...INTEGRATION_DATA_MODELS.GOOGLE_SHEETS, user: data.user, selectedAction: data.selectedAction });
            }
          }
        } catch (e) {
          setError(e);
          setDeletingUser(false);
        }
      },
    });
  };

  const users = integration_users['Google Sheets'] || [];
  const selectedUserEmail = _.get(data, ['user', 'user_data', 'email'], '');

  return (
    <DropdownHeader headerText="As user" headerSuffixText={selectedUserEmail} isOpened={isOpened} toggle={toggle}>
      {deletingUser ? (
        <Spinner isEmpty />
      ) : (
        users.map((e, i) => {
          return (
            <div
              key={i}
              className={cn('btn', 'btn-clear', 'btn-block', {
                active: user && user.user_id === e.user_id,
              })}
              onClick={() => selectUser(e)}
            >
              <div className="close mt-3" onClick={(ev) => deleteUser(ev, e)} />
              <div className="d-flex flex-row">
                <div className="flex-row align-self-center" />
                <div className="text-left">
                  <b>{e.user_data && e.user_data.name}</b>
                  {e.user_data && e.user_data.email && (
                    <>
                      <br />
                      <small>{e.user_data && e.user_data.email}</small>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
      <DefaultModal
        open={addUserModalOpened}
        header="Connect Google Account"
        toggle={toggleAddUserModal}
        content={
          <AddGoogleUserModal
            toggle={toggleAddUserModal}
            onError={(e) => setError(e)}
            onSuccess={(newUser) => {
              if (integration_user_error) {
                setError(integration_user_error);
                return;
              }

              const newUserData = newUser['Google Sheets'][0];

              onChange({ user: newUserData });
              toggleAddUserModal();
              clearModal();
            }}
            skill_id={skill_id}
          />
        }
        hideFooter={true}
        noPadding={true}
      />
      <SquareButton onClick={() => addGoogleUser()} text="+ Add User" />
    </DropdownHeader>
  );
}

const mapStateToProps = {
  integration_users: integrationUsersSelector,
  integration_users_loading: integrationUsersLoadingSelector,
  integration_user_error: integrationUsersErrorSelector,
  skill_id: activeSkillIDSelector,
  user: userSelector,
};

const mapDispatchToProps = {
  setConfirm: (confirm) => setConfirm(confirm),
  clearModal: () => clearModal(),
  setError: (error) => setError(error),
  deleteUser: (integration, data) => deleteIntegrationUser(integration, data),
};

export default connect(mapStateToProps, mapDispatchToProps)(AddGoogleUser);
