import { colors, FlexApart } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

export const Container = styled(FlexApart)<{ hasShadow: boolean }>`
  height: 72px;
  padding: 26px 32px;
  width: 100%;
  z-index: 99;
  background-color: transparent;

  ${({ hasShadow }) =>
    hasShadow &&
    css`
      box-shadow: 0 1px 3px 0 rgba(19, 33, 68, 0.08);
      border-bottom: solid 1px ${colors('borders')};
    `}
`;

export const LabelContainer = styled.div`
  font-weight: normal;
  color: ${colors('primary')};
`;
