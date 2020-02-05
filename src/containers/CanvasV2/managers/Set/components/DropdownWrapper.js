import Flex from '@/componentsV2/Flex';
import { styled, units } from '@/hocs';

const DropdownWrapper = styled(Flex)`
  margin-left: -8px;

  & > * {
    margin-right: ${units()}px;
    margin-bottom: 0;
    white-space: nowrap;
  }
`;

export default DropdownWrapper;
