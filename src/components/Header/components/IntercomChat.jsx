import React from 'react';
import Intercom from 'react-intercom';
import { connect } from 'react-redux';

import { createIntercomUser } from '@/vendors/intercom';

export function IntercomChat({ user }) {
  const intercomUser = createIntercomUser(user);

  return <Intercom appID="vw911b0m" {...intercomUser} />;
}

const mapStateToProps = (state) => ({
  user: state.account,
});

export default connect(mapStateToProps)(IntercomChat);
