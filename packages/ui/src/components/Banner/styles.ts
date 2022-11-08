import Button from '@ui/components/Button';
import { colors, css, styled, ThemeColor, transition } from '@ui/styles';

export const CloseButton = styled(Button).attrs({ variant: Button.Variant.WHITE })`
  width: 24px;
  height: 24px;
  padding: 0;
  ${transition('opacity')};
  position: absolute;
  top: -8px;
  right: -8px;
  opacity: 0;
  border-radius: 50%;
  color: rgba(110, 132, 154, 0.65);
  box-shadow: 0px 0px 0px rgba(19, 33, 68, 0.08), 0px 1px 3px rgba(19, 33, 68, 0.12);
`;

export const OuterContainer = styled.div<{ isOpen: boolean }>`
  width: 100%;
  max-height: 162px;
  padding: 0px 16px 32px;

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
  height: 98px;
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
  height: 22px;
  padding-top: 4px;
  text-align: left;
  line-height: 22px;
`;
