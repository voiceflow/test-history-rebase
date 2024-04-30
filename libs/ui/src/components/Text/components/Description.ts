import React from 'react';
import { color, layout, space, typography } from 'styled-system';

import { css, styled } from '@/styles';

const Description = styled.div(
  layout,
  space,
  typography,
  color,
  ({ theme }) => css`
    width: 370px;
    margin-bottom: 40px;
    color: ${theme.colors.secondary};
    font-size: ${theme.fontSizes.m};
    line-height: 1.47;
    text-align: center;
  `
);

export default React.memo(Description);
