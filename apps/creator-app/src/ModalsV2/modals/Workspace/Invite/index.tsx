import React from 'react';

import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';

import manager from '../../../manager';
import { DoubleModal, SingleModal } from './components';

const Invite = manager.create('WorkspaceInvite', () => (props) => {
  const isEnterprise = useSelector(WorkspaceV2.active.isEnterpriseSelector);
  const isFree = !useSelector(WorkspaceV2.active.isOnPaidPlanSelector);

  return isEnterprise || isFree ? <DoubleModal {...props} /> : <SingleModal {...props} />;
});

export default Invite;
