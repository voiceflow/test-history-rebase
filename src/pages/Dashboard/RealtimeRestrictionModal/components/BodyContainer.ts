import Flex from '@/components/Flex';
import { styled } from '@/hocs';

const BodyContainer = styled(Flex)`
  padding: 24px 32px 48px 32px;
  font-size: 15px;
  line-height: 22px;
  text-align: center;
  div {
    margin-top: 16px;
  }
  span {
    font-weight: 600;
  }
`;

export default BodyContainer;
