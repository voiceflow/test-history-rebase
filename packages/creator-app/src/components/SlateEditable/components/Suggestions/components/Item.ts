import { backgrounds, colors, Menu, ThemeColor } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

export const activeStyle = css`
  background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, ${backgrounds('greyGreen')} 100%), ${colors(ThemeColor.WHITE)}fff;

  &:hover {
    background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, ${backgrounds('greyGreen')} 100%), ${colors(ThemeColor.WHITE)}fff;
  }
`;

const Item = styled(Menu.Item)`
  &:hover {
    background: #fff;
  }

  ${({ active }) => active && activeStyle}
`;

export default Item;
