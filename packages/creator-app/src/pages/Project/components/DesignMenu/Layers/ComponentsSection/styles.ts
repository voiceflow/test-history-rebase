import { colors, FlexCenter, SvgIcon, ThemeColor } from '@voiceflow/ui';

import { styled, transition } from '@/hocs/styled';

export const Placeholder = styled.p<{ width: number | string | undefined }>`
  position: relative;
  min-height: 141px;
  width: ${({ width = '100%' }) => (typeof width === 'number' ? `${width}px` : width)};
  padding: 0 24px;
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

  a {
    margin-top: 4px;
    display: inline-flex;
    line-height: normal;
  }
`;

export const CollapseIconContainer = styled(FlexCenter)<{ active?: boolean }>`
  width: 16px;
  height: 16px;
  cursor: pointer;
  transform: rotate(-90deg);

  ${SvgIcon.Container} {
    ${transition('opacity')}
    color: #6e849a;
    opacity: 0.65;
  }
`;
