import React from 'react';
import ReactIntercom from 'react-intercom';

import SwallowError from '@/components/ErrorPages/SwallowError';
import { INTERCOM_APP_ID } from '@/config';
import { FeatureFlag } from '@/config/features';
import * as Account from '@/ducks/account';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { ConnectedProps } from '@/types';
import * as Intercom from '@/vendors/intercom';

export const IntercomChat: React.FC<ConnectedIntercomChatProps> = ({ user, workspace }) => {
  const intercomIntegration = useFeature(FeatureFlag.INTERCOM_INTEGRATION);

  if (!intercomIntegration.isEnabled) {
    return null;
  }

  const intercomUser = Intercom.createUser(user, workspace);

  return (
    <SwallowError>
      <ReactIntercom appID={INTERCOM_APP_ID} {...intercomUser} />
    </SwallowError>
  );
};

const mapStateToProps = {
  workspace: Workspace.activeWorkspaceSelector,
  user: Account.userSelector,
};

type ConnectedIntercomChatProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(IntercomChat);

export const RemoveIntercom: React.FC = ({ children }) => {
  const intercomIntegration = useFeature(FeatureFlag.INTERCOM_INTEGRATION);

  React.useEffect(() => {
    if (!intercomIntegration.isEnabled) return undefined;

    Intercom.updateSettings({ hide_default_launcher: true });

    return () => Intercom.updateSettings({ hide_default_launcher: false });
  }, []);

  return <>{children}</>;
};
