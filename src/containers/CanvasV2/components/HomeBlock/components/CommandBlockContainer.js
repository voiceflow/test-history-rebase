import { MemberIcon } from '@/components/User';
import { FlexApart } from '@/componentsV2/Flex';
import { styled, units } from '@/hocs';

const CommandBlockContainer = styled(FlexApart)`
  flex: 1;
  height: ${units(4)}px;

  & > * {
    margin: 0 12px;
  }

  ${MemberIcon} {
    margin-right: ${units(2)}px;
  }
`;

export default CommandBlockContainer;
