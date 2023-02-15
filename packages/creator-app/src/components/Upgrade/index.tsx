import { ClickableText, stopImmediatePropagation, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { ModalType } from '@/constants';
import { useModals } from '@/hooks';

import UpgradeContainer from './UpgradeContainer';

const Upgrade: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { toggle: togglePayment } = useModals(ModalType.PAYMENT);

  return (
    <UpgradeContainer onClick={stopImmediatePropagation()}>
      <SvgIcon icon="upgrade" color="#279745" mr={16} />
      {children}&nbsp;
      <ClickableText onClick={togglePayment}>Upgrade.</ClickableText>
    </UpgradeContainer>
  );
};

export default Upgrade;
