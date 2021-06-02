import Flex from '@/components/Flex';
import { styled, units } from '@/hocs';

const ControlsContainer = styled(Flex)`
  & > *:not(:first-child) {
    margin-left: ${units()}px;
  }

  & > *:not(:last-child) {
    margin-right: ${units()}px;
  }
`;

export default ControlsContainer;
