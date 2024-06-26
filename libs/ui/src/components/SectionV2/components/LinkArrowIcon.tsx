import SvgIcon from '@ui/components/SvgIcon';
import { styled } from '@ui/styles';
import React from 'react';

import Status from './Status';

export interface LinkArrowIconProps {
  className?: string;
}

const LinkArrowIcon: React.FC<LinkArrowIconProps> = ({ className }) => (
  <Status color={Status.Color.SECONDARY} hidden={false}>
    <SvgIcon icon="arrowToggle" size={10} inline className={className} rotation={90} />
  </Status>
);

export default styled(LinkArrowIcon)``;
