import { Box } from '@voiceflow/ui';

import { styled, transition } from '@/hocs';

const LogicOptionDisplay = styled(Box.FlexCenter)`
  ${transition('color', 'opacity')}

  cursor: pointer;
  padding-right: 3px;
  font-weight: 600;

  &:hover {
    color: #3d82e2;
  }
`;

export default LogicOptionDisplay;
