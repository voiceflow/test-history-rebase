import { css, styled } from '@ui/styles';

import Text from './Text';

export const overflowTextStyles = css`
  overflow-x: hidden;

  white-space: nowrap;
  text-overflow: ellipsis;
`;

const OverflowText = styled(Text)`
  ${overflowTextStyles}
`;

export default OverflowText;
