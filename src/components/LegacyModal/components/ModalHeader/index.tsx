import CSS from 'csstype';
import React from 'react';

import Flex from '@/components/Flex';
import InfoIcon from '@/components/InfoIcon';
import Icon from '@/components/SvgIcon';
import { Identifier } from '@/styles/constants';

import { HeaderTextContainer, ModalHeaderContainer } from './components';

export type ModalHeaderProps = {
  className?: string;
  header?: React.ReactNode;
  tooltip?: React.ReactNode;
  toggle?: () => void;
  style?: CSS.Properties;
};

const ModalHeader: React.FC<ModalHeaderProps> = ({ header, toggle, children, className, tooltip }) => (
  <ModalHeaderContainer className={className}>
    {children || (
      <Flex as="h5">
        <HeaderTextContainer id={Identifier.MODAL_TITLE_CONTAINER}>{header}</HeaderTextContainer>
        {tooltip && <InfoIcon tooltipProps={{ portalNode: window.document.body }}>{tooltip}</InfoIcon>}
      </Flex>
    )}
    <Icon id={Identifier.MODAL_CLOSE_BUTTON_REGULAR} icon="close" onClick={toggle} size={12} />
  </ModalHeaderContainer>
);

export default ModalHeader;
