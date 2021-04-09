import React from 'react';
import { color, layout, space, typography } from 'styled-system';

import { css, styled } from '@/hocs';

const Description = styled.div(
  layout,
  space,
  typography,
  color,
  css`
    font-size: ${({ theme }) => theme.fontSizes.m};
    color: ${({ theme }) => theme.colors.secondary};

    width: 370px;
    line-height: 1.47;
    text-align: center;
    margin-bottom: 40px;
  `
);

export default React.memo(Description);
