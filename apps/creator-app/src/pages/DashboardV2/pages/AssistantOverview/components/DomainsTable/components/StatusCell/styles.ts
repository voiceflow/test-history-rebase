import { Box, SvgIcon } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

export const Icon = styled(SvgIcon)`
  ${transition('opacity')}
  display: inline-block;
  margin-left: 8px;
  margin-top: 2px;
  transform: rotate(90deg);
  opacity: 0;
  color: #6e849a;
`;

const containerActiveStyles = css`
  color: #4a88de;

  ${Icon} {
    color: #4a88de;
    opacity: 0.85;
  }
`;

export const Container = styled(Box.Flex)<{ active: boolean; rowHovered?: boolean }>`
  ${transition('color')}

  color: #62778c;
  cursor: pointer;

  &:hover {
    ${Icon} {
      opacity: 0.85;
    }
  }

  ${({ rowHovered }) =>
    rowHovered &&
    css`
      ${Icon} {
        opacity: 0.65;
      }
    `}

  ${({ active }) => active && containerActiveStyles}
`;
