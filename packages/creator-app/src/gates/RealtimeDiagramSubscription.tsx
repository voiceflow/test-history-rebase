import React from 'react';

import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { useDiagramSubscription } from '@/hooks';
import { ConnectedProps } from '@/types';

const RealtimeDiagramSubscription: React.FC<RealtimeDiagramSubscriptionConnectedProps> = ({ diagramID }) => {
  useDiagramSubscription(diagramID);

  return null;
};

const mapStateToProps = {
  diagramID: Session.activeDiagramIDSelector,
};

type RealtimeDiagramSubscriptionConnectedProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(RealtimeDiagramSubscription);
