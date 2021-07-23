import { colors, FlexApart } from '@voiceflow/ui';

import { styled } from '@/hocs';

export const Container = styled(FlexApart)`
  height: 72px;
  padding: 26px 32px;
  width: 100%;
  backdrop-filter: blur(8px);
  background-color: rgba(255, 255, 255, 0.85);
`;

export const LabelContainer = styled.div`
  font-weight: normal;
  color: ${colors('primary')};
`;
