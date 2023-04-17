import { colors, FlexApart, ThemeColor } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

export const Container = styled(FlexApart)<{ hasShadow: boolean }>`
  height: ${({ theme }) => theme.components.page.header.height}px;
  padding: 26px 32px;
  border-bottom: 1px solid transparent;
  transition: all 0.15s ease-in-out;

  width: 100%;
  z-index: 99;
  background-color: transparent;

  ${({ hasShadow }) =>
    hasShadow &&
    css`
      border-bottom: 1px solid #dfe3ed;
    `}
`;

export const LabelContainer = styled.div`
  font-weight: normal;
  color: ${colors(ThemeColor.PRIMARY)};
`;
