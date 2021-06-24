import { css, styled } from '../../../styles';
import Text from './Text';

export const overflowTextStyles = css`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const OverflowText = styled(Text)`
  ${overflowTextStyles}
`;

export default OverflowText;
