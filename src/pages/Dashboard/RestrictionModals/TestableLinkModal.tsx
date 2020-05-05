import React from 'react';

import { ModalType } from '@/constants';
import { BoldText } from '@/pages/Dashboard/components/ModalComponents';
import BaseModal from '@/pages/Dashboard/components/RedirectToPaymentBaseModal';

const TestableLinkModal: React.FC = () => {
  return (
    <BaseModal
      modalType={ModalType.TESTABLE_LINKS}
      header="Testable Links"
      icon="/testable-link.svg"
      bodyContent={
        <>
          This is a <BoldText>Pro</BoldText> feature. Please upgrade your workspace to share testable links.
        </>
      }
    />
  );
};

export default TestableLinkModal;
