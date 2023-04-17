import { Box } from '@voiceflow/ui';

import { styled, transition } from '@/hocs/styled';

interface ScaleContainerProps {
  scale: number;
  isMobile?: boolean;
}

const ScaleContainer = styled(Box)<ScaleContainerProps>`
  ${transition('transform')};
  transform: ${({ scale }) => `scale(${scale})`};
  transform-origin: ${({ isMobile }) => (isMobile ? 'top' : 'center')};
`;

export default ScaleContainer;
