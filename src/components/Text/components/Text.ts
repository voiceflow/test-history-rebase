import { color, layout, space, typography } from 'styled-system';

import { styled } from '@/hocs';

import { TextProps } from '../types';

export const Text = styled.span<TextProps>(space, color, layout, typography);
export const BlockText = styled.div<TextProps>(space, color, layout, typography);

export default Text;
