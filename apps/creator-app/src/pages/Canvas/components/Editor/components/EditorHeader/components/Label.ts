import { flexLabelStyles } from '@voiceflow/ui';

import { styled, transition } from '@/hocs/styled';

const Label = styled.a.attrs({ href: '' })`
  ${flexLabelStyles}
  ${transition('color')}
  color: #5d9df5;
  overflow: hidden;

  &:hover {
    color: #4986da;
  }

  &:active {
    color: #4986da;
  }
`;

export default Label;
