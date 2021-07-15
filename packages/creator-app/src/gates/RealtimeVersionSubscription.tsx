import React from 'react';

import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { useVersionSubscription } from '@/hooks';
import { ConnectedProps } from '@/types';

const RealtimeVersionSubscription: React.FC<RealtimeVersionSubscriptionConnectedProps> = ({ versionID }) => {
  useVersionSubscription(versionID);

  return null;
};

const mapStateToProps = {
  versionID: Session.activeVersionIDSelector,
};

type RealtimeVersionSubscriptionConnectedProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(RealtimeVersionSubscription);
