import { BaseNode } from '@voiceflow/base-types';
import { Button, Spinner, SvgIcon } from '@voiceflow/ui';
import _get from 'lodash/get';
import React from 'react';
import { connect } from 'react-redux';

import * as Account from '@/ducks/account';
import * as Integration from '@/ducks/integration';
import * as Session from '@/ducks/session';
import { useToggle } from '@/hooks/toggle';
import * as ModalsV2 from '@/ModalsV2';

import { DEFAULT_DATA } from '../../../../../../constants';
import SquareButton from '../../components/SquareButton';
import DropdownHeader from '../../components/StepDropdown';
import AddGoogleUserModal from './AddGoogleUserModal';

function AddGoogleUser({
  data,
  toggle,
  onChange,
  isOpened,
  versionID,
  openNextStep,
  integration_users,
  integration_user_error,
  deleteUser: deleteIntUser,
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
      onChange({ ...DEFAULT_DATA[BaseNode.Utils.IntegrationType.GOOGLE_SHEETS], user, selectedAction: data.selectedAction });
      openNextStep();
    }
  };

  const deleteUser = (ev, targetUser) => {
    ModalsV2.openConfirm({
      body: 'Are you sure you want to remove this user?',
      header: 'Remove User',
      confirmButtonText: 'Remove',

      confirm: async () => {
        try {
          setDeletingUser(true);

          await deleteIntUser('Google Sheets', {
            user: targetUser,
            creator_id: targetUser.creator_id,
            skill_id: versionID,
          });

          setDeletingUser(false);

          if (integration_user_error) {
            ModalsV2.openError({ error: integration_user_error });
          } else if (targetUser.user_data?.email === data?.user?.user_data?.email) {
            onChange({ user: {} });
            onChange({ ...DEFAULT_DATA[BaseNode.Utils.IntegrationType.GOOGLE_SHEETS], selectedAction: data.selectedAction });
          } else {
            onChange({ ...DEFAULT_DATA[BaseNode.Utils.IntegrationType.GOOGLE_SHEETS], user: data.user, selectedAction: data.selectedAction });
          }
        } catch (e) {
          ModalsV2.openError({ error: e });
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
          <Button key={i} variant={Button.Variant.SECONDARY} onClick={() => selectUser(e)} isActive={user?.user_id === e.user_id}>
            <SvgIcon mt={3} icon="close" clickable onClick={(ev) => deleteUser(ev, e)} />

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
          </Button>
        ))
      )}

      {addUserModalOpened && (
        <AddGoogleUserModal
          toggle={toggleAddUserModal}
          onError={(e) => ModalsV2.openError({ error: e })}
          onSuccess={(newUser) => {
            if (integration_user_error) {
              ModalsV2.openError({ error: integration_user_error });
              return;
            }

            const newUserData = newUser['Google Sheets'][0];

            onChange({ user: newUserData });
            toggleAddUserModal();
            ModalsV2.closeConfirm();
          }}
          skill_id={versionID}
        />
      )}

      <SquareButton onClick={() => addGoogleUser()} text="+ Add User" />
    </DropdownHeader>
  );
}

const mapStateToProps = {
  user: Account.userSelector,
  versionID: Session.activeVersionIDSelector,
  integration_users: Integration.integrationUsersSelector,
  integration_user_error: Integration.integrationUsersErrorSelector,
  integration_users_loading: Integration.integrationUsersLoadingSelector,
};

const mapDispatchToProps = {
  deleteUser: Integration.deleteIntegrationUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddGoogleUser);
