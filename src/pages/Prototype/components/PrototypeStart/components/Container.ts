import Flex from '@/components/Flex';
import { styled } from '@/hocs';

const Container = styled(Flex).attrs({ column: true })`
  height: 100%;
  padding-top: 100px;
  color: #62778c;
  background-color: #fff;

  & > * {
    margin-bottom: 20px;
  }
`;

export default Container;
