import Box from '@ui/components/Box';
import Button from '@ui/components/Button';
import { colors, css, styled, ThemeColor } from '@ui/styles';

export const CloseButton = styled(Button).attrs({
  variant: Button.Variant.WHITE,
  iconProps: { size: 8 },
  tiny: true,
})`
  ${Button.WhiteButton.Icon} {
    color: rgb(110, 132, 154, 0.65);
    opacity: 0.85;
  }

  &:hover {
    ${Button.WhiteButton.Icon} {
      color: #6e849a;
      opacity: 1;
    }
  }

  &:active {
    ${Button.WhiteButton.Icon} {
      color: #132144;
      opacity: 1;
    }
  }

  top: -8px;
  right: -8px;
  opacity: 0;
  box-shadow: 0px 0px 0px 1px rgba(19, 33, 68, 0.08), 0px 1px 3px rgba(19, 33, 68, 0.12);
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
  background-color: ${colors(ThemeColor.SKY_BLUE)};
  background-repeat: no-repeat;

  ${({ backgroundImage }) =>
    backgroundImage &&
    css`
      background-image: url('${backgroundImage}');
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
