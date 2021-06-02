import { css, styled, units } from '@/hocs';

export const horizontalDividerStyles = css`
  width: 100%;
  border-top: 1px solid #dfe3ed;
  margin: ${units(1.5)}px 0;
`;

const HorizontalDivider = styled.hr`
  ${horizontalDividerStyles}
`;

export default HorizontalDivider;
