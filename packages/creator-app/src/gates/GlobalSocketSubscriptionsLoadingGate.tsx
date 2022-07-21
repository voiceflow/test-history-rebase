import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Prototype from '@/ducks/prototype';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { usePrototypingMode } from '@/pages/Project/hooks';
import { ConnectedProps } from '@/types';

const GlobalSocketSubscriptionsLoadingGate: React.FC<ConnectedGlobalSocketSubscriptionsLoadingGateProps> = ({
  children,
  setWebhookData,
  activeProjectID,
}) => {
  const isPrototypingMode = usePrototypingMode();
  const atomicActionsPhase2 = useFeature(Realtime.FeatureFlag.ATOMIC_ACTIONS_PHASE_2);

  React.useEffect(() => {
    if (atomicActionsPhase2.isEnabled) return undefined;

    return client.socket.global.watchForceRefresh(() => window.location.reload());
  }, []);

  React.useEffect(
    () =>
      client.socket.global.watchForPrototypeWebhook(({ payload, projectID }) => {
        if (activeProjectID === projectID) {
          if (isPrototypingMode) {
            setWebhookData(payload);
          } else {
            toast.error('Please go to Test tool.');
          }
        } else {
          toast.error('Project ID does not match.');
        }
      }),
    []
  );

  return <>{children}</>;
};

const mapStateToProps = {
  activeProjectID: Session.activeProjectIDSelector,
};

const mapDispatchToProps = {
  setWebhookData: Prototype.updatePrototypeWebhookData,
};

type ConnectedGlobalSocketSubscriptionsLoadingGateProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(GlobalSocketSubscriptionsLoadingGate);
