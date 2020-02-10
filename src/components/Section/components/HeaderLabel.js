import { overflowTextStyles } from '@/components/Text/OverflowText';
import { styled, units } from '@/hocs';

const HeaderLabel = styled.div`
  ${overflowTextStyles}

  /* truncated text hack https://css-tricks.com/flexbox-truncated-text/ */
  min-width: 0;
  margin-right: ${units(2)}px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

export default HeaderLabel;
