import React from 'react';
import type { SpaceProps } from 'styled-system';
import { space } from 'styled-system';

import type { SvgIconTypes } from '@/components/SvgIcon';
import SvgIcon from '@/components/SvgIcon';
import { styled, transition } from '@/styles';

import { PreviewColors } from '../constants';

const ButtonContainer = styled.div`
  ${transition('background-color', 'color')};
  width: 40px;
  height: 28px;
  background-color: ${PreviewColors.GREY_LIGHT_BACKGROUND_COLOR};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 6px;
  ${space};

  &:hover {
    background-color: ${PreviewColors.GREY_HOVER_BACKGROUND_COLOR};
  }
`;

const ButtonIcon = styled(SvgIcon)`
  color: rgba(255, 255, 255, 0.85);

  &:hover {
    color: #f2f7f7;
  }
`;

export interface PreviewButtonIconProps extends SpaceProps, React.HTMLAttributes<HTMLDivElement> {
  icon: SvgIconTypes.Icon;
}

const PreviewButtonIcon: React.FC<PreviewButtonIconProps> = ({ icon, ...props }) => (
  <ButtonContainer {...props}>
    <ButtonIcon icon={icon} color="rgba(255, 255, 255, 0.85)" />
  </ButtonContainer>
);

export default PreviewButtonIcon;
