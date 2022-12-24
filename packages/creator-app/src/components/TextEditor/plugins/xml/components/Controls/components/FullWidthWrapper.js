import { Flex } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const FullWidthWrapper = styled(Flex)`
  height: ${({ theme }) => theme.components.input.height}px;
  padding: 12px 18px;

  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;

  color: #6e849a;
  background-color: #fdfdfd;
  border-top: 1px solid #eaeff4;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;

  cursor: default;
  z-index: 0;
`;

export default FullWidthWrapper;
