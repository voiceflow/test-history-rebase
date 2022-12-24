import { Input, ThemeColor } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';
import THEME from '@/styles/theme';

export const TitleInput = styled(Input)<{ minWidth?: number; fontSize?: number }>`
  border-radius: 0;
  border: none !important;
  box-shadow: none !important;
  padding: 0;
  height: 23px;
  min-height: 0px;

  ${({ minWidth = 300 }) => css`
    min-width: ${minWidth}px;
  `}

  ${({ fontSize }) =>
    fontSize &&
    css`
      font-size: ${fontSize}px;
    `}
  color: ${THEME.colors[ThemeColor.PRIMARY]};
  font-weight: 600;
  min-height: 23px;
`;
