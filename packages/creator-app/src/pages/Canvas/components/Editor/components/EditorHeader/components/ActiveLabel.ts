import { flexLabelStyles } from '@voiceflow/ui';

import { styled, transition } from '@/hocs/styled';

const ActiveLabel = styled.span`
  ${flexLabelStyles}
  ${transition('color')}
  color: #4986da;
  cursor: default;
  text-decoration: underline;
`;

export default ActiveLabel;
