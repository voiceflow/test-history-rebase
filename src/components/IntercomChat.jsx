import React from 'react';
import Intercom from 'react-intercom';

import { INTERCOM_ENABLED } from '@/config';
import { userSelector } from '@/ducks/account';
import { activeWorkspaceSelector } from '@/ducks/workspace';
import { connect } from '@/hocs';
import { createIntercomUser } from '@/vendors/intercom';

export function IntercomChat({ user, workspace }) {
  if (!INTERCOM_ENABLED) {
    return null;
  }

  const intercomUser = createIntercomUser(user, workspace);
  return <Intercom appID="vw911b0m" {...intercomUser} />;
}

const mapStateToProps = {
  workspace: activeWorkspaceSelector,
  user: userSelector,
};

export default connect(mapStateToProps)(IntercomChat);
