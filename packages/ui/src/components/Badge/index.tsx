import { backgrounds, colors, css, styled, ThemeColor, units } from '@ui/styles';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type BadgeProps = {
  onClick?: React.MouseEventHandler;
  slide?: boolean;
  marginLeft?: number;
  color?: string;
};

const Badge = styled.div.attrs((props) => (props.onClick ? { role: 'button' } : {}))<BadgeProps>`
  ${({ marginLeft }) =>
    marginLeft &&
    css`
      margin-left: ${marginLeft}px;
    `}
  ${({ onClick }) =>
    !!onClick &&
    css`
      cursor: pointer;
    `}
  ${({ slide }) =>
    slide &&
    css`
      animation: fadein 0.15s ease, moveinleft 0.15s ease;
    `}
  display: inline-block;
  box-sizing: border-box;
  min-width: 22px;
  height: ${units(2.8)}px;
  margin-top: -4px;
  margin-bottom: -4px;
  padding-right: 8px;
  padding-left: 8px;
  font-weight: 600;
  font-size: 12px;
  line-height: 24px;
  text-align: center;
  border-radius: 5px;

  ${({ color }) =>
    color
      ? css`
          color: ${colors(ThemeColor.WHITE)};
          background: ${color};
          border: 1px solid ${color};
        `
      : css`
          color: ${colors(ThemeColor.SECONDARY)};
          background: linear-gradient(180deg, #eff5f6a3 0%, ${backgrounds('greyGreen')} 100%), ${backgrounds('white')};
          box-shadow: 0 1px 0 #d4d9e6;
        `}
`;

export default Badge;
