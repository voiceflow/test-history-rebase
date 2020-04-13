import { flexApartStyles } from '@/components/Flex';
import { styled } from '@/hocs';

const DeleteComponentWrapper = styled.div.attrs({ column: true })`
  position: sticky;
  bottom: 0;
  ${flexApartStyles}
  width: 100%;
  height: 110px;
  padding-top: 22px;
  padding-bottom: 8px;
  background: #fdfdfd;
  border-top: 1px solid #eaeff4;
  border-bottom: 1px solid #eaeff4;
`;

export default DeleteComponentWrapper;
