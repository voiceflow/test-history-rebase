import { BaseNode } from '@voiceflow/base-types';
import { Spinner } from '@voiceflow/ui';
import cn from 'classnames';
import _get from 'lodash/get';
import React from 'react';

import { DefaultModal } from '@/components/modals';
import { FeatureFlag } from '@/config/features';
import * as Account from '@/ducks/account';
import * as Integration from '@/ducks/integration';
import * as Modal from '@/ducks/modal';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks/feature';
import { useToggle } from '@/hooks/toggle';

import { DEFAULT_DATA } from '../../../../constants';
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
  clearModal,
  deleteUser: deleteIntUser,
  versionID,
}) {
  const disableIntegrations = useFeature(FeatureFlag.DISABLE_INTEGRATIONS).isEnabled;

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
      onChange({ ...DEFAULT_DATA[BaseNode.Utils.IntegrationType.GOOGLE_SHEETS], user, selectedAction: data.selectedAction });
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
            skill_id: versionID,
          });
          setDeletingUser(false);

          if (integration_user_error) {
            setError(integration_user_error);
          } else if (targetUser.user_data?.email === data?.user?.user_data?.email) {
            onChange({ user: {} });
            onChange({ ...DEFAULT_DATA[BaseNode.Utils.IntegrationType.GOOGLE_SHEETS], selectedAction: data.selectedAction });
          } else {
            onChange({ ...DEFAULT_DATA[BaseNode.Utils.IntegrationType.GOOGLE_SHEETS], user: data.user, selectedAction: data.selectedAction });
          }
        } catch (e) {
          setError(e);
          setDeletingUser(false);
        }
      },
    });
  };

  const users = integration_users['Google Sheets'] || [];
  const selectedUserEmail = _get(data, ['user', 'user_data', 'email'], '');

  return (
    <DropdownHeader headerText="As user" headerSuffixText={selectedUserEmail} isOpened={isOpened} toggle={toggle}>
      {deletingUser ? (
        <Spinner isEmpty />
      ) : (
        users.map((e, i) => (
          <div
            key={i}
            className={cn('btn', 'btn-clear', 'btn-block', {
              active: user && user.user_id === e.user_id,
            })}
            onClick={() => selectUser(e)}
          >
            {!disableIntegrations && <div className="close mt-3" onClick={(ev) => deleteUser(ev, e)} />}
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
        ))
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
            skill_id={versionID}
          />
        }
        hideFooter={true}
        noPadding={true}
      />
      {!disableIntegrations && <SquareButton onClick={() => addGoogleUser()} text="+ Add User" />}
    </DropdownHeader>
  );
}

const mapStateToProps = {
  integration_users: Integration.integrationUsersSelector,
  integration_users_loading: Integration.integrationUsersLoadingSelector,
  integration_user_error: Integration.integrationUsersErrorSelector,
  versionID: Session.activeVersionIDSelector,
  user: Account.userSelector,
};

const mapDispatchToProps = {
  setConfirm: Modal.setConfirm,
  clearModal: Modal.clearModal,
  setError: Modal.setError,
  deleteUser: Integration.deleteIntegrationUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddGoogleUser);
