import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { goToLogin } from '@/ducks/router';
import { restoreSession } from '@/ducks/session';
import { connect } from '@/hocs';
import { isLoggingInSelector } from '@/store/selectors';

const AccountLoadingGate = ({ children, isLoggingIn, restoreSession }) => (
  <LoadingGate label="Account" isLoaded={!isLoggingIn} load={restoreSession}>
    {children}
  </LoadingGate>
);

const mapStateToProps = {
  isLoggingIn: isLoggingInSelector,
};

const mapDispatchToProps = {
  restoreSession,
  goToLogin,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountLoadingGate);
