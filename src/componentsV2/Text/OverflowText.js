import { css, styled } from '@/hocs';

export const overflowTextStyles = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OverflowText = styled.span`
  ${overflowTextStyles}
`;

export default OverflowText;
