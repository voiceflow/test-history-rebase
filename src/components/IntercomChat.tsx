import React from 'react';
import { useDispatch } from 'react-redux';
import { useIntercom } from 'react-use-intercom';

import { FeatureFlag } from '@/config/features';
import * as Account from '@/ducks/account';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import { compose, connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { ConnectedProps } from '@/types';
import * as Intercom from '@/vendors/intercom';
import * as LogRocket from '@/vendors/logRocket';

export const IntercomChat: React.FC<ConnectedIntercomChatProps> = ({ user, workspace, isVisible, isLoggedIn }) => {
  const isRunning = React.useRef(false);
  const intercom = useIntercom();
  const intercomIntegration = useFeature(FeatureFlag.INTERCOM_INTEGRATION);

  const showIntercom = intercomIntegration.isEnabled && isVisible && !!workspace;

  React.useEffect(() => {
    if (!isLoggedIn) return undefined;

    return () => {
      intercom.shutdown();
      isRunning.current = false;
    };
  }, [isLoggedIn]);

  React.useEffect(() => {
    if (showIntercom) {
      intercom.boot(Intercom.createProps(user, workspace!));
      LogRocket.getSessionURL((sessionURL) => intercom.trackEvent('LogRocket', { sessionURL, company_id: workspace!.id }));

      isRunning.current = true;
    } else if (isRunning.current) {
      intercom.shutdown();
    }
  }, [showIntercom]);

  return null;
};

const mapStateToProps = {
  isVisible: Session.isIntercomVisibleSelector,
  isLoggedIn: Session.isLoggedInSelector,
  workspace: Workspace.activeWorkspaceSelector,
  user: Account.userSelector,
};

type ConnectedIntercomChatProps = ConnectedProps<typeof mapStateToProps>;

export default compose(React.memo, connect(mapStateToProps))(IntercomChat);

export const RemoveIntercom: React.FC = ({ children }) => {
  const dispatch = useDispatch();
  const intercomIntegration = useFeature(FeatureFlag.INTERCOM_INTEGRATION);

  React.useEffect(() => {
    if (!intercomIntegration.isEnabled) return undefined;

    dispatch(Session.hideIntercom());

    return () => {
      dispatch(Session.showIntercom());
    };
  }, []);

  return <>{children}</>;
};
