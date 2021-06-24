import { color, layout, space, typography } from 'styled-system';

import { css, styled } from '../../../styles';
import Box from '../../Box';
import { TextProps as BaseTextProps } from '../types';

export type TextProps = BaseTextProps & {
  trim?: boolean;
};

const Text = styled.span<TextProps>(
  space,
  color,
  layout,
  typography,
  css<TextProps>`
    ${(props) =>
      props.trim &&
      css`
        display: inline-flex;
        white-space: nowrap;
      `}
  `
);

export const BlockText = styled(Box)<TextProps>(space, color, layout, typography);

export default Text;
