import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { isLoggingInSelector } from '@/store/selectors';
import { ConnectedProps } from '@/types';

const AccountLoadingGate: React.FC<ConnectedAccountLoadingGateProps> = ({ children, isLoggingIn, restoreSession }) => (
  <LoadingGate label="Account" isLoaded={!isLoggingIn} load={restoreSession}>
    {children}
  </LoadingGate>
);

const mapStateToProps = {
  isLoggingIn: isLoggingInSelector,
};

const mapDispatchToProps = {
  restoreSession: Session.restoreSession,
};

type ConnectedAccountLoadingGateProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(AccountLoadingGate);
