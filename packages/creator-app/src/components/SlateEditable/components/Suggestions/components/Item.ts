import { backgrounds, colors, MenuItem } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

export const activeStyle = css`
  background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, ${backgrounds('greyGreen')} 100%), ${colors('white')}fff;

  &:hover {
    background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, ${backgrounds('greyGreen')} 100%), ${colors('white')}fff;
  }
`;

const Item = styled(MenuItem)`
  &:hover {
    background: #fff;
  }

  ${({ active }) => active && activeStyle}
`;

export default Item;
