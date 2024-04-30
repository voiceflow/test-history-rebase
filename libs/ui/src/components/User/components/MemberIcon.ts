import { css, styled, transition } from '@/styles';

export interface MemberIconProps {
  flat?: boolean;
  small?: boolean;
  large?: boolean;
  medium?: boolean;
  extraLarge?: boolean;
  square?: boolean;
}

const MemberIcon = styled.div<MemberIconProps>`
  ${transition('color', 'border')}
  width: 28px;
  height: 28px;
  line-height: 28px;
  font-size: 14px;
  text-align: center;
  color: #becedc;
  position: relative;
  background-color: #fff;
  background-position: center center;
  background-size: cover;
  font-weight: 600;
  text-transform: uppercase;
  user-select: none;
  border-radius: ${({ square }) => (square ? '20%' : '100%')};
  cursor: default;

  ${({ flat }) =>
    flat
      ? css`
          box-shadow: 0 0 0 2px transparent;
        `
      : css`
          box-shadow:
            0 0 0 2px #fff,
            0 1px 2px 2px rgba(17, 49, 96, 0.16);
        `}
  ${({ small }) =>
    small &&
    css`
      width: 18px;
      height: 18px;
      font-size: 11px;
      line-height: 18px;
    `}

  ${({ medium }) =>
    medium &&
    css`
      width: 32px;
      height: 32px;
      font-size: 16px;
      line-height: 32px;
    `}

  ${({ large }) =>
    large &&
    css`
      width: 42px;
      height: 42px;
      font-size: 18px;
      line-height: 42px;
    `}

    ${({ extraLarge }) =>
    extraLarge &&
    css`
      width: 70px;
      height: 70px;
      font-size: 24px;
      line-height: 70px;
    `}

  & > * {
    display: inline-block;
  }
`;

export default MemberIcon;
