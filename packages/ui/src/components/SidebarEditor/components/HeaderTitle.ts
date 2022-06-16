import { styled } from '@ui/styles';

import { Box } from '../../Box';

const HeaderTitle = styled(Box)<{ fontWeight?: number | string }>`
  flex: 1;
  overflow: hidden;
  font-size: 18px;
  font-weight: ${({ fontWeight = 700 }) => fontWeight};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export default HeaderTitle;
