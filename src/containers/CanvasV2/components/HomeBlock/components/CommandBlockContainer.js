import { FlexApart } from '@/componentsV2/Flex';
import { styled } from '@/hocs';

const CommandBlockContainer = styled(FlexApart)`
  flex: 1;

  & > * {
    margin: 0 12px;
  }
`;

export default CommandBlockContainer;
