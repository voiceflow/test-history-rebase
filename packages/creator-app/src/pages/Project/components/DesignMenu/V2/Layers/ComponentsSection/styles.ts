import { colors, FlexCenter, SvgIcon, ThemeColor } from '@voiceflow/ui';

import { styled } from '@/hocs';

export const Placeholder = styled.p<{ width: number }>`
  position: relative;
  min-height: 141px;
  width: ${({ width }) => width}px;
  padding: 0 12px;
  font-size: 13px;
  line-height: 1.53;
  color: ${colors(ThemeColor.SECONDARY)};

  b {
    color: ${colors(ThemeColor.PRIMARY)};
    font-weight: normal;
  }

  ${SvgIcon.Container} {
    color: #eff5f7;
    position: absolute;
    top: 20px;
    right: 29px;
    z-index: -1;
  }
`;

export const CollapseIconContainer = styled(FlexCenter)`
  width: 16px;
  height: 16px;
  cursor: pointer;
  transform: rotate(-90deg);
`;
