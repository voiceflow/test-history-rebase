import { colors, FlexApart, ThemeColor } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

export const Container = styled(FlexApart)<{ hasShadow: boolean }>`
  height: 65px;
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
      box-shadow: 0 1px 3px 0 rgba(19, 33, 68, 0.08);
    `}
`;

export const LabelContainer = styled.div`
  font-weight: normal;
  color: ${colors(ThemeColor.PRIMARY)};
`;
