import React from 'react';
import ReactIntercom from 'react-intercom';

import { INTERCOM_APP_ID, INTERCOM_ENABLED } from '@/config';
import * as Account from '@/ducks/account';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';
import * as Intercom from '@/vendors/intercom';

export const IntercomChat: React.FC<ConnectedIntercomChatProps> = ({ user, workspace }) => {
  if (!INTERCOM_ENABLED) {
    return null;
  }

  const intercomUser = Intercom.createUser(user, workspace);
  return <ReactIntercom appID={INTERCOM_APP_ID} {...intercomUser} />;
};

const mapStateToProps = {
  workspace: Workspace.activeWorkspaceSelector,
  user: Account.userSelector,
};

type ConnectedIntercomChatProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(IntercomChat);
