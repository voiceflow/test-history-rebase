import { flexApartStyles } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const DeleteComponentContent = styled.div.attrs({ column: true })`
  ${flexApartStyles}
  pointer-events: all;
  width: 100%;
  height: 100px;
  padding-top: 22px;
`;

export default DeleteComponentContent;
