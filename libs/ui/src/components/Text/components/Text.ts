import Box from '@ui/components/Box';
import type { TextProps as BaseTextProps } from '@ui/components/Text/types';
import { css, styled } from '@ui/styles';
import { color, layout, space, typography } from 'styled-system';

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
