import { css, styled } from '@/hocs';

import { BlockText } from './Text';

export const overflowTextStyles = css`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const OverflowText = styled(BlockText)`
  ${overflowTextStyles}
`;

export default OverflowText;
