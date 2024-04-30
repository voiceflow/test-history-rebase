import React from 'react';
import { layout, space, typography } from 'styled-system';

import { styled } from '@/styles';

const Title = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  font-size: ${({ theme }) => `${theme.fontSizes.l}px`};
  text-align: center;

  ${layout}
  ${typography}
  ${space}
`;

export default React.memo(Title);
