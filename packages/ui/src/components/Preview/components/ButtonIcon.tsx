import SvgIcon from '@ui/components/SvgIcon';
import { styled } from '@ui/styles';
import { ClassName } from '@ui/styles/constants';
import React from 'react';
import { space, SpaceProps } from 'styled-system';

import { PreviewColors } from '../constants';

const ButtonContainer = styled.div`
  width: 40px;
  height: 28px;
  min-width: 40px;
  min-height: 28px;
  background-color: ${PreviewColors.GREY_LIGHT_BACKGROUND_COLOR};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 6px;
  ${space};

  &:hover {
    background-color: ${PreviewColors.GREY_HOVER_BACKGROUND_COLOR};

    ${ClassName.SVG_ICON} {
      color: #fff;
    }
  }
`;

export interface PreviewButtonIconProps extends SpaceProps {
  icon: string;
}

const PreviewButtonIcon: React.FC<PreviewButtonIconProps> = ({ icon, ...props }) => {
  return (
    <ButtonContainer {...props}>
      <SvgIcon icon={icon as any} color="#fff" />
    </ButtonContainer>
  );
};

export default PreviewButtonIcon;
