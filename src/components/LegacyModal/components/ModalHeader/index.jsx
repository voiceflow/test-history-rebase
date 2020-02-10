import React from 'react';

import Flex from '@/components/Flex';
import InfoIcon from '@/components/InfoIcon';
import Icon from '@/components/SvgIcon';

import { HeaderTextContainer, ModalHeaderContainer } from './components';

const ModalHeader = ({ header, toggle, children, className, tooltip }) => {
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
