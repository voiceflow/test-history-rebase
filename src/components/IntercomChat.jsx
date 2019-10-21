import React from 'react';
import Intercom from 'react-intercom';

import { userSelector } from '@/ducks/account';
import { connect } from '@/hocs';
import { createIntercomUser } from '@/vendors/intercom';

export function IntercomChat({ user }) {
  const intercomUser = createIntercomUser(user);

  return <Intercom appID="vw911b0m" {...intercomUser} />;
}

const mapStateToProps = {
  user: userSelector,
};

export default connect(mapStateToProps)(IntercomChat);
