import { Box, SvgIcon } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

export const Icon = styled(SvgIcon)`
  display: inline-block;
  margin-left: 8px;
  margin-top: 2px;
  transform: rotate(90deg);
  opacity: 0;
  color: #6e849a;
`;

const containerHoverStyles = css`
  color: #3d82e2;

  ${Icon} {
    color: #3d82e2;
    opacity: 1;
  }
`;

export const Container = styled(Box.Flex)<{ active: boolean; rowHovered?: boolean }>`
  ${transition('color')}

  cursor: pointer;

  ${({ rowHovered }) =>
    rowHovered &&
    css`
      ${Icon} {
        opacity: 0.85;
      }
    `}

  &:hover {
    ${containerHoverStyles}
  }

  ${({ active }) => active && containerHoverStyles}
`;
