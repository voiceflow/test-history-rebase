import { css, styled } from '@ui/styles';
import React from 'react';
import { color, layout, space, typography } from 'styled-system';

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
