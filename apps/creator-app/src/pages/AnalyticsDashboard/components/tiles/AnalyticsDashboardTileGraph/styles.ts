import { Box, SvgIcon } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

export interface TrendProps {
  color: string | undefined;
  delta: number;
}

export const DeltaLabel = styled(Box.Flex)`
  white-space: break-spaces;
`;

export const Trend = styled(Box.Flex)<TrendProps>`
  font-size: 13px;
  font-weight: 600;

  ${({ color }) =>
    color &&
    css`
      color: ${color};
    `}

  ${({ delta }) =>
    delta < 0 &&
    css`
      ${SvgIcon.Container} {
        transform: scaleY(-1);
      }
    `}
`;
