import SvgIcon, { SvgIconTypes } from '@ui/components/SvgIcon';
import { styled, transition } from '@ui/styles';
import React from 'react';
import { space, SpaceProps } from 'styled-system';

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
