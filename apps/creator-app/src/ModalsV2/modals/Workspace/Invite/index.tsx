import React from 'react';

import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';

import manager from '../../../manager';
import { DoubleModal, SingleModal } from './components';

const Invite = manager.create('WorkspaceInvite', () => (props) => {
  const subscription = useSelector(Organization.chargebeeSubscriptionSelector);
  const isEnterprise = useSelector(WorkspaceV2.active.isEnterpriseSelector);
  const isFree = !useSelector(WorkspaceV2.active.isOnPaidPlanSelector);
  const isTrial = useSelector(WorkspaceV2.active.isOnTrialSelector);

  return isEnterprise || isFree || isTrial || subscription?.id ? (
    <DoubleModal {...props} />
  ) : (
    <SingleModal {...props} />
  );
});

export default Invite;
