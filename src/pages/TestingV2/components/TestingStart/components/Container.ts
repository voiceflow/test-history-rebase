import Flex from '@/components/Flex';
import { styled } from '@/hocs';

const Container = styled(Flex).attrs({ column: true })`
  padding-top: 100px;
  color: #62778c;

  & > * {
    margin-bottom: 20px;
  }
`;

export default Container;
