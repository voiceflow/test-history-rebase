import React from 'react';

import Flex from '@/components/Flex';
import InfoIcon from '@/components/InfoIcon';
import Icon from '@/components/SvgIcon';

import { HeaderTextContainer, ModalHeaderContainer } from './components';

export type ModalHeaderProps = {
  className?: string;
  header?: React.ReactNode;
  tooltip?: React.ReactNode;
  toggle?: () => void;
};

const ModalHeader: React.FC<ModalHeaderProps> = ({ header, toggle, children, className, tooltip }) => {
  return (
    <ModalHeaderContainer className={className}>
      {children || (
        <Flex as="h5">
          <HeaderTextContainer>{header}</HeaderTextContainer>
          {tooltip && <InfoIcon tooltipProps={{ portalNode: window.document.body }}>{tooltip}</InfoIcon>}
        </Flex>
      )}
      <Icon icon="close" onClick={toggle} size={12} />
    </ModalHeaderContainer>
  );
};

export default ModalHeader;
