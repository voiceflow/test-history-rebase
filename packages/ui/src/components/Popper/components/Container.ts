import { styled } from '@ui/styles';
import { FadeDown } from '@ui/styles/animations';

const Container = styled.div`
  ${FadeDown}

  display: flex;
  border-radius: 5px;
  box-shadow: 0 8px 16px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06);
  background-color: #fff;
  overflow: hidden;
`;

export default Container;
