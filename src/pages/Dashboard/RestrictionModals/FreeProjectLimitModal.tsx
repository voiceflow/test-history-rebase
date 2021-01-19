import React from 'react';

import { ModalType } from '@/constants';
import { UpgradePrompt } from '@/ducks/tracking';
import { useModals, useTrackingEvents } from '@/hooks';
import { BoldText } from '@/pages/Dashboard/components/ModalComponents';

import BaseModal from '../components/RedirectToPaymentBaseModal';

const FreeProjectLimitModal: React.FC = () => {
  const { data, isOpened } = useModals<{ projects?: number; message?: string }>(ModalType.FREE_PROJECT_LIMIT);
  const [trackingEvents] = useTrackingEvents();

  React.useEffect(() => {
    if (!isOpened) return;

    trackingEvents.trackUpgradePrompt({ promptType: UpgradePrompt.PROJECT_LIMIT });
  }, [isOpened]);

  return (
    <BaseModal
      modalType={ModalType.FREE_PROJECT_LIMIT}
      header="Free Project Limit"
      icon="/project-limit.svg"
      bodyContent={
        <>
          {data.message || `You've reached your ${data.projects} free project limit`}. Upgrade to <BoldText>unlock unlimited projects.</BoldText>
        </>
      }
    />
  );
};

export default FreeProjectLimitModal;
