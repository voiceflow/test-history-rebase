import React from 'react';

import { teamGraphic } from '@/assets';
import { ModalType } from '@/constants';
import { UpgradePrompt } from '@/ducks/tracking';
import { useModals, useTrackingEvents } from '@/hooks';
import BaseModal from '@/pages/Dashboard/components/RedirectToPaymentBaseModal';

const RealtimeDeniedModal: React.OldFC = () => {
  const { isOpened } = useModals(ModalType.REALTIME_DENIED);
  const [trackingEvents] = useTrackingEvents();

  React.useEffect(() => {
    if (!isOpened) return;

    trackingEvents.trackUpgradePrompt({ promptType: UpgradePrompt.REAL_TIME_COLLABORATION });
  }, [isOpened]);

  return (
    <BaseModal
      modalType={ModalType.REALTIME_DENIED}
      header="Realtime Collaboration"
      icon={teamGraphic}
      bodyContent={
        <>
          A teammate is actively editing this assistant. Real-time collaboration is a <b>Pro</b> feature, please upgrade your plan to continue.
        </>
      }
    />
  );
};

export default RealtimeDeniedModal;
