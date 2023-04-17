import { backgrounds, colors, css, styled, ThemeColor, transition, units } from '@ui/styles';
import { space, SpaceProps } from 'styled-system';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type BadgeProps = {
  onClick?: React.MouseEventHandler;
  slide?: boolean;
  marginLeft?: number;
  color?: string;
  flat?: boolean;
  active?: boolean;
};

const Badge = styled.div.attrs((props) => (props.onClick ? { role: 'button' } : {}))<BadgeProps>`
  ${transition('background', 'color')}
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

  ${({ flat }) =>
    flat &&
    css`
      box-shadow: none;
      background: white;
      border-radius: 6px;
      border: solid 1px #dfe3ed;
      padding: 3px 8px;
      line-height: 15px;
    `}

  ${({ active }) =>
    active &&
    css`
      background: #eef4f6;
      font-weight: 600;
      color: #132144;
    `}
`;

const descriptiveBadgeColors = {
  blue: '#3d82e2',
  gray: '#949DB0',
};

export const DescriptiveBadge = styled.div<{ color?: 'blue' | 'gray' } & SpaceProps>`
  font-size: 10px;
  text-transform: uppercase;
  color: ${({ color = 'blue' }) => descriptiveBadgeColors[color]};
  font-weight: 700;
  border-radius: 11px;
  box-shadow: 0px 1px 0px rgba(19, 33, 68, 0.12), 0px 0px 1px rgba(19, 33, 68, 0.2);
  background-color: #ffffff;
  display: inline-flex;
  padding: 3px 8px 2px 8px;
  ${space}
`;

export default Object.assign(Badge, {
  Descriptive: DescriptiveBadge,
});
