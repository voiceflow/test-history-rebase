import Box from '@ui/components/Box';
import SvgIcon from '@ui/components/SvgIcon';
import { styled } from '@ui/styles';
import React from 'react';

import Status from './Status';

export interface LinkArrowIconProps {
  className?: string;
}

const LinkArrowIcon: React.FC<LinkArrowIconProps> = ({ className }) => (
  <Box.FlexCenter color={Status.Color.SECONDARY} size={16}>
    <SvgIcon icon="arrowToggle" size={10} inline className={className} rotation={90} />
  </Box.FlexCenter>
);

export default styled(LinkArrowIcon)``;
