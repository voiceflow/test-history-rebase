import Box from '@ui/components/Box';
import Button from '@ui/components/Button';
import { colors, css, styled, ThemeColor } from '@ui/styles';

export const CloseButton = styled(Button).attrs({ variant: Button.Variant.WHITE, iconProps: { size: 8 }, tiny: true })`
  top: -8px;
  right: -8px;
  opacity: 0;
`;

export const OuterContainer = styled(Box)`
  width: 100%;
  max-height: 162px;
`;

export const Container = styled.div<{ backgroundImage?: string }>`
  padding: 24px 32px;
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

export const TextContainer = styled(Box.Flex)<{ small?: boolean }>`
  flex-direction: column;
  margin-right: ${({ small }) => (small ? 16 : 32)}px;
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
