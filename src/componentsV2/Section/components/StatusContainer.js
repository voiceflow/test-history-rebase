import { FlexCenter } from '@/componentsV2/Flex';
import { styled, units } from '@/hocs';

const StatusContainer = styled(FlexCenter)`
  &:not(:last-child) {
    margin-right: ${units(2)}px;
  }
`;
export default StatusContainer;
