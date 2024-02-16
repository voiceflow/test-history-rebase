import { Subscription } from '@voiceflow/dtos';
import { toast } from '@voiceflow/ui';
import React from 'react';

import * as Organization from '@/ducks/organization';
import { useDispatch, useSelector } from '@/hooks';

// eslint-disable-next-line no-restricted-syntax
export enum Status {
  IDLE = 'IDLE',
  ERROR = 'ERROR',
  FETCHED = 'FETCHED',
  FETCHING = 'FETCHING',
}

export interface ScheduledSubscriptionAPI {
  data: Subscription | null;
  isReady: boolean;
  refetch: () => void;
}

export const useScheduledSubscription = (): ScheduledSubscriptionAPI => {
  const organization = useSelector(Organization.organizationSelector);
  const scheduledSubscription = useSelector(Organization.chargebeeScheduledSubscriptionSelector);
  const fetchScheduledSubscription = useDispatch(Organization.loadActiveOrganizationSchduledSubscription);

  const [status, setStatus] = React.useState(Status.IDLE);

  const loadScheduledSubscription = async () => {
    setStatus(Status.FETCHING);
    if (!organization?.subscription || !organization.chargebeeSubscriptionID) return;

    if (!organization.subscription.hasScheduledChanges) {
      setStatus(Status.FETCHED);
      return;
    }

    try {
      await fetchScheduledSubscription(organization.id, organization.chargebeeSubscriptionID);
      setStatus(Status.FETCHED);
    } catch (error) {
      setStatus(Status.ERROR);
      toast.error('Something went wrong, please retry');
    }
  };

  React.useEffect(() => {
    loadScheduledSubscription();
  }, [organization?.chargebeeSubscriptionID, organization?.subscription?.hasScheduledChanges]);

  return {
    data: organization?.subscription?.hasScheduledChanges ? scheduledSubscription ?? null : null,
    isReady: status === Status.FETCHED,
    refetch: loadScheduledSubscription,
  };
};
