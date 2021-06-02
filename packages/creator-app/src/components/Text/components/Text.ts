import { color, layout, space, typography } from 'styled-system';

import Box from '@/components/Box';
import { css, styled } from '@/hocs';

import { TextProps as BaseTextProps } from '../types';

export type TextProps = BaseTextProps & {
  trim?: boolean;
};

export const Text = styled.span<TextProps>(
  space,
  color,
  layout,
  typography,
  css`
    ${(props: TextProps) =>
      props.trim &&
      css`
        white-space: nowrap;
        display: inline-flex;
      `}
  `
);
export const BlockText = styled(Box)<TextProps>(space, color, layout, typography);

export default Text;
