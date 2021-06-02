import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import { ClickableText } from '@/components/Text';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';
import { stopImmediatePropagation } from '@/utils/dom';

import UpgradeContainer from './UpgradeContainer';

const Upgrade: React.FC = ({ children }) => {
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
