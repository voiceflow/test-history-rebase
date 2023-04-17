import { BoxFlexCenter } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const ActionButtonContainer = styled(BoxFlexCenter)`
  padding: 10px 15px;

  :last-child {
    padding-right: 0;
  }
`;

export default ActionButtonContainer;
