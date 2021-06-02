import React from 'react';
import { layout, space, typography } from 'styled-system';

import { styled } from '@/hocs';

const Title = styled.div`
  font-size: ${({ theme }) => `${theme.fontSizes.l}px`};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;

  ${layout}
  ${typography}
  ${space}
`;

export default React.memo(Title);
