import { Box, SvgIcon } from '@voiceflow/ui';

import { styled, transition } from '@/hocs/styled';

export const PromptSelectContainer = styled(Box.Flex)`
  width: fit-content;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  gap: 8px;

  ${SvgIcon.Container} {
    ${transition('color', 'opacity')};
    opacity: 0.85;
  }

  &:hover ${SvgIcon.Container} {
    opacity: 1;
  }
`;
