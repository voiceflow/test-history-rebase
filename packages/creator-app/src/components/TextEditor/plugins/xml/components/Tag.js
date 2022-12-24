import { transparentize } from 'polished';

import { styled, transition } from '@/hocs/styled';

const Tag = styled.span.attrs(({ color, isHovered }) => ({
  style: { color, backgroundColor: isHovered ? transparentize(0.85, color) : 'transparent' },
  contentEditable: false,
}))`
  ${transition('background-color')}
  display: inline-block;
  cursor: default !important;
  word-break: normal;
`;

export default Tag;
