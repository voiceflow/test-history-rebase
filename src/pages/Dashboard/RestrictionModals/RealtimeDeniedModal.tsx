import React from 'react';

import { ModalType } from '@/constants';
import { BoldText } from '@/pages/Dashboard/components/ModalComponents';
import BaseModal from '@/pages/Dashboard/components/RedirectToPaymentBaseModal';

const RealtimeDeniedModal: React.FC = () => {
  return (
    <BaseModal
      modalType={ModalType.REALTIME_DENIED}
      header="Realtime Collaboration"
      icon="/team-feature.svg"
      bodyContent={
        <>
          A teammate is actively editing this project. Real-time collaboration is a <BoldText>Pro</BoldText> feature, please upgrade your plan to
          continue.
        </>
      }
    />
  );
};

export default RealtimeDeniedModal;
