import { css, styled } from '@/hocs';

import { Text } from './Text';

export const overflowTextStyles = css`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-word;
`;

const OverflowText = styled(Text)`
  ${overflowTextStyles}
`;

export default OverflowText;
