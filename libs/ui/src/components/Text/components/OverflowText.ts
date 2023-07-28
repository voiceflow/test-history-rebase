import { IS_CHROME } from '@ui/config';
import { css, styled } from '@ui/styles';

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
