import { LimitType } from '@/constants/limits';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { usePaymentModal, useUpgradeModal } from '@/ModalsV2/hooks';

import { usePlanLimitedConfig } from './planLimitV2';
import { useSelector } from './redux';

export const useActiveWorkspace = () => useSelector(WorkspaceV2.active.workspaceSelector);

export const useOnAddSeats = () => {
  const numberOfSeats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
  const usedEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);

  const limitConfig = usePlanLimitedConfig(LimitType.EDITOR_SEATS, { limit: numberOfSeats, value: usedEditorSeats });

  const paymentModal = usePaymentModal();
  const upgradeModal = useUpgradeModal();

  return (newSeats?: number) => {
    if (!limitConfig?.increasableLimit || limitConfig.increasableLimit > (newSeats ?? usedEditorSeats)) {
      paymentModal.open({});
    } else {
      upgradeModal.open(limitConfig.upgradeModal(limitConfig.payload));
    }
  };
};
