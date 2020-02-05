import Flex from '@/componentsV2/Flex';
import { styled } from '@/hocs';

const FullWidthWrapper = styled(Flex)`
  height: ${({ theme }) => theme.components.input.height}px;
  padding: 10px 0 10px 16px;

  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;

  color: #6e849a;
  box-shadow: rgba(17, 49, 96, 0.08) 0px 1px 3px, rgba(17, 49, 96, 0.08) 0px -1px 0px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;

  cursor: default;
  z-index: 0;
`;

export default FullWidthWrapper;
