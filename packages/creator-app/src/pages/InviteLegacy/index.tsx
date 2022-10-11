import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';

import { Path } from '@/config/routes';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import * as Query from '@/utils/query';

/**
 * @deprecated should be removed when identity service is fully rolled out
 */
const InviteLegacy = () => {
  const location = useLocation();
  const authToken = useSelector(Session.authTokenSelector);

  const { invite_code: inviteCode, ...restQuery } = Query.parse(location.search);

  const search = Query.stringify({ ...restQuery, invite: inviteCode });

  return authToken ? <Redirect to={`${Path.DASHBOARD}${search}`} /> : <Redirect to={`${Path.SIGNUP}${search}`} />;
};

export default InviteLegacy;
