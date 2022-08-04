import React from 'react';

import { linkGraphic } from '@/assets';
import { ModalType } from '@/constants';
import BaseModal from '@/pages/Dashboard/components/RedirectToPaymentBaseModal';

const TestableLinkModal: React.FC = () => (
  <BaseModal
    modalType={ModalType.TESTABLE_LINKS}
    header="Testable Links"
    icon={linkGraphic}
    bodyContent={
      <>
        This is a <b>Pro</b> feature. Please upgrade your workspace to share testable links.
      </>
    }
  />
);

export default TestableLinkModal;
