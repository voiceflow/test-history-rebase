import React from 'react';

import { ModalType } from '@/constants';
import { useModals } from '@/hooks';
import { BoldText } from '@/pages/Dashboard/components/ModalComponents';

import BaseModal from '../components/RedirectToPaymentBaseModal';

const FreeProjectLimitModal: React.FC = () => {
  const { data } = useModals<{ projects?: number; message?: string }>(ModalType.FREE_PROJECT_LIMIT);

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
