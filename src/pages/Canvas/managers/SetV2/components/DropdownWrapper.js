import Flex from '@/components/Flex';
import { styled, units } from '@/hocs';

const DropdownWrapper = styled(Flex)`
  margin-left: -${units(0.5)}px;

  & > * {
    margin-right: ${units()}px;
    margin-bottom: 0;
    white-space: nowrap;
  }
`;

export default DropdownWrapper;
