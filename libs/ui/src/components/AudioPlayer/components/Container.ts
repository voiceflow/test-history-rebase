import { FlexCenter } from '@ui/components/Flex';
import { styled, transition } from '@ui/styles';

import CloseButton from './CloseButton';

const Container = styled(FlexCenter)`
  height: ${({ theme }) => theme.components.audioPlayer.height}px;
  border: 1px solid #dfe3ed;
  border-radius: 8px;
  padding: 0 32px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100%;
  background: #fff;

  ${CloseButton} {
    ${transition('opacity')}
    opacity: 0;
  }

  &:hover ${CloseButton} {
    opacity: 1;
  }
`;

export default Container;
