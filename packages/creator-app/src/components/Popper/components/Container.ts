import { styled } from '@/hocs';
import { FadeDown } from '@/styles/animations';

const Container = styled.div`
  ${FadeDown}

  display: flex;
  border-radius: 5px;
  box-shadow: 0 8px 16px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06);
  background-color: #fff;
`;

export default Container;
