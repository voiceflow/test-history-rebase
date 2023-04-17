import { flexStyles } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const Breadcrumbs = styled.div.attrs({ fullWidth: true })`
  ${flexStyles}
  text-transform: capitalize;
  margin-bottom: 5px;
`;

export default Breadcrumbs;
