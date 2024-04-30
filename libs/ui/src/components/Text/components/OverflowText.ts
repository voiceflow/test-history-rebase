import { IS_CHROME } from '@/config';
import { css, styled } from '@/styles';

import Text from './Text';

export const overflowTextStyles = css`
  overflow-x: ${IS_CHROME ? 'clip' : 'hidden'};

  white-space: nowrap;
  text-overflow: ellipsis;
`;

const OverflowText = styled(Text)`
  ${overflowTextStyles}
`;

export default OverflowText;
