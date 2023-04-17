import { flexApartStyles } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const DeleteComponentContent = styled.div.attrs({ column: true })`
  ${flexApartStyles}
  pointer-events: all;
  width: 100%;
  height: 100px;
  padding-top: 32px;
  padding-bottom: 10px;
  color: #8da2b5;
`;

export default DeleteComponentContent;
