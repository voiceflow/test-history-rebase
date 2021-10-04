import { backgrounds, colors, Flex, ThemeColor } from '@voiceflow/ui';

import { styled, units } from '@/hocs';

export interface ModalFooterProps {
  justifyContent?: string;
}

const ModalFooter = styled(Flex)<ModalFooterProps>`
  justify-content: ${({ justifyContent }) => justifyContent || 'flex-end'};
  padding: ${units(3)}px ${units(4)}px;
  background: ${backgrounds('gray')};
  border-top: 1px solid ${colors(ThemeColor.SEPERATOR_SECONDARY)};
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
`;

export default ModalFooter;
