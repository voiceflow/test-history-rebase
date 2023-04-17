import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';

import { Path } from '@/config/routes';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import * as Query from '@/utils/query';

const WorkspaceAcceptInvite = () => {
  const location = useLocation();
  const authToken = useSelector(Session.authTokenSelector);

  const { inviteToken, ...restQuery } = Query.parse(location.search);

  const search = Query.stringify({ ...restQuery, invite: inviteToken });

  return authToken ? <Redirect to={`${Path.DASHBOARD}${search}`} /> : <Redirect to={`${Path.SIGNUP}${search}`} />;
};

export default WorkspaceAcceptInvite;
