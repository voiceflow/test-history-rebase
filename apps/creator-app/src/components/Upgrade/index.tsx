import { stopImmediatePropagation, SvgIcon, System } from '@voiceflow/ui';
import React from 'react';

import { usePaymentModal } from '@/hooks/modal.hook';

import UpgradeContainer from './UpgradeContainer';

const Upgrade: React.FC<React.PropsWithChildren> = ({ children }) => {
  const paymentModal = usePaymentModal();

  return (
    <UpgradeContainer onClick={stopImmediatePropagation()}>
      <SvgIcon icon="upgrade" color="#279745" mr={16} />
      {children}&nbsp;
      <System.Link.Button onClick={() => paymentModal.openVoid({})}>Upgrade.</System.Link.Button>
    </UpgradeContainer>
  );
};

export default Upgrade;
