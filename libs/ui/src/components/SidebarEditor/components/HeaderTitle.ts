import { styled } from '@ui/styles';

import { Box } from '../../Box';

const HeaderTitle = styled(Box)<{ fontWeight?: number | string; fontSize?: number }>`
  flex: 1;
  overflow: hidden;
  font-size: ${({ fontSize = 18 }) => `${fontSize}px`};
  font-weight: ${({ fontWeight = 700 }) => fontWeight};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export default HeaderTitle;
