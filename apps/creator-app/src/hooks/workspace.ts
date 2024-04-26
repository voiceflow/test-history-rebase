import { QuotaNames } from '@voiceflow/realtime-sdk';
import { useMemo } from 'react';

import { LimitType } from '@/constants/limits';
import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useAddSeatsModal, usePaymentModal, useUpgradeModal } from '@/hooks/modal.hook';

import { useGetPlanLimitedConfig } from './planLimitV2';
import { useGetConditionalLimit } from './planLimitV3';
import { useSelector } from './redux';

export const useActiveWorkspace = () => useSelector(WorkspaceV2.active.workspaceSelector);

export const useOnAddSeats = () => {
  const numberOfSeats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
  const usedEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);
  const isPaid = useSelector(WorkspaceV2.active.isOnPaidPlanSelector);
  const isOnProTrial = useSelector(WorkspaceV2.active.isOnProTrialSelector);
  const subscription = useSelector(Organization.chargebeeSubscriptionSelector);

  const getLimitConfig = useGetPlanLimitedConfig(LimitType.EDITOR_SEATS, { limit: numberOfSeats });
  const getConditionalLimit = useGetConditionalLimit(LimitType.EDITOR_SEATS);

  const paymentModal = usePaymentModal();
  const addSeatsModal = useAddSeatsModal();
  const upgradeModal = useUpgradeModal();

  return (newSeats?: number) => {
    const seats = newSeats ?? usedEditorSeats;
    // FIXME: remove FF https://voiceflow.atlassian.net/browse/CV3-994
    const limitConfig = subscription
      ? getConditionalLimit({
          value: seats,
          greaterOnly: Number.isFinite(newSeats) && usedEditorSeats !== newSeats,
        })
      : getLimitConfig({
          value: seats,
          greaterOnly: Number.isFinite(newSeats) && usedEditorSeats !== newSeats,
        });

    if (!limitConfig?.payload?.maxLimit || limitConfig.payload.maxLimit > seats) {
      if (!isPaid || isOnProTrial) {
        addSeatsModal.open({});
        return;
      }
      paymentModal.open({});
    } else {
      upgradeModal.open(limitConfig.upgradeModal(limitConfig.payload));
    }
  };
};

export const useActiveWorkspaceTokenUsage = () => {
  const workspace = useActiveWorkspace();

  const quotaData = useMemo(() => workspace?.quotas?.find((quota: any) => quota.quotaDetails.name === QuotaNames.TOKENS), [workspace?.quotas]);

  return {
    quota: quotaData?.quota ?? 0,
    consumed: quotaData?.consumed ?? 0,
  };
};
