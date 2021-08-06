import { Flex } from '@voiceflow/ui';

import { styled, units } from '@/hocs';

export interface ModalFooterProps {
  justifyContent?: string;
}

const ModalFooter = styled(Flex)<ModalFooterProps>`
  justify-content: ${({ justifyContent }) => justifyContent || 'flex-end'};
  padding: ${units(3)}px ${units(4)}px;
  background: #f6f6f6;
  border-top: 1px solid #eaeff4;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;

export default ModalFooter;
