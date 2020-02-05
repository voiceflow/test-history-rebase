import React from 'react';

import Icon from '@/components/SvgIcon';
import Flex from '@/componentsV2/Flex';
import InfoIcon from '@/componentsV2/InfoIcon';

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
