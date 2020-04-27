import { overflowTextStyles } from '@/components/Text';
import { styled, units } from '@/hocs';

type HeaderLabelProps = {
  disabled?: boolean;
};

const HeaderLabel = styled.div<HeaderLabelProps>`
  ${overflowTextStyles}

  /* truncated text hack https://css-tricks.com/flexbox-truncated-text/ */
  min-width: 0;
  margin-right: ${units(1.5)}px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

export default HeaderLabel;
