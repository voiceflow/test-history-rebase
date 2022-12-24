import { Flex } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

import SizeOption from './TeamSizeOption';

const TeamSizeRowContainer = styled(Flex)`
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;

  ${SizeOption} {
    flex: 1 1 30%; /*grow | shrink | basis */
  }
`;

export default TeamSizeRowContainer;
