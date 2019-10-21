import Flex from '@/componentsV2/Flex';
import { styled } from '@/hocs';

const AddStepButtonContainer = styled(Flex)`
  position: absolute;
  top: calc(100% - ${({ theme }) => theme.unit * 2}px);
  z-index: 10;
`;

export default AddStepButtonContainer;
