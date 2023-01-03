import Box from '@ui/components/Box';
import Button from '@ui/components/Button';
import { colors, css, styled, ThemeColor } from '@ui/styles';
import { space, SpaceProps } from 'styled-system';

export interface OuterContainerProps extends SpaceProps {
  isOpen: boolean;
}

export const CloseButton = styled(Button).attrs({ variant: Button.Variant.WHITE, iconProps: { size: 8 }, tiny: true })`
  top: -8px;
  right: -8px;
  opacity: 0;
`;

export const OuterContainer = styled.div<OuterContainerProps>`
  width: 100%;
  max-height: 162px;
  ${space};

  ${({ isOpen }) =>
    isOpen
      ? css`
          display: visible;
        `
      : css`
          display: none;
          height: 0;
        `}
`;

export const Container = styled.div<{ backgroundImage?: string }>`
  border-radius: 8px;
  min-height: 98px;
  width: 100%;
  position: relative;

  ${({ backgroundImage }) =>
    backgroundImage
      ? css`
          background-image: url('${backgroundImage}');
        `
      : css`
          background-color: ${colors(ThemeColor.SKY_BLUE)};
        `}

  &:hover ${CloseButton} {
    opacity: 1;
  }
`;

export const Title = styled.div`
  font-weight: bold;
  color: ${colors(ThemeColor.PRIMARY)};
  font-size: 18px;
  height: 24px;
  width: 100%;
  text-align: left;
`;

export const SubTitle = styled.div`
  width: 100%;
  font-weight: 400;
  color: ${colors(ThemeColor.SECONDARY)};
  font-size: 15px;
  padding-top: 4px;
  text-align: left;
  line-height: 22px;
`;

export const ButtonBox = styled(Box)`
  padding: 28px 32px;
`;
