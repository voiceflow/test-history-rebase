import { colors, ThemeColor } from '@voiceflow/ui';

import { styled } from '@/hocs';

const Placeholder = styled.p<{ width: number }>`
  width: ${({ width }) => width}px;
  padding: 0 16px;
  font-size: 13px;
  line-height: 1.38;
  color: ${colors(ThemeColor.SECONDARY)};

  b {
    color: ${colors(ThemeColor.PRIMARY)};
    font-weight: normal;
  }
`;

export default Placeholder;
