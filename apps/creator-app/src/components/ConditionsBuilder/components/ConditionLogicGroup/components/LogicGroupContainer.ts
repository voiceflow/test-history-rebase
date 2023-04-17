import { Box } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

import DeleteButtonContainer from './DeleteButtonContainer';

const LogicGroupContainer = styled(Box)`
  border-radius: 5px;
  border: 1px dashed #d4d9e6;
  margin-bottom: 16px;
  position: relative;
  padding: 16px 40px 16px 16px;

  :hover {
    ${DeleteButtonContainer} {
      display: block;
    }
  }
`;

export default LogicGroupContainer;
