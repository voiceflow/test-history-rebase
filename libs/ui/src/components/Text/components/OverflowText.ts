import { IS_FIREFOX } from '@ui/config';
import { css, styled } from '@ui/styles';

import Text from './Text';

export const overflowTextStyles = css`
  overflow-x: ${IS_FIREFOX ? 'hidden' : 'clip'};

  white-space: nowrap;
  text-overflow: ellipsis;
`;

const OverflowText = styled(Text)`
  ${overflowTextStyles}
`;

export default OverflowText;
