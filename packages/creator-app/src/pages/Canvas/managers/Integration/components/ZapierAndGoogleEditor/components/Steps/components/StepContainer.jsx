import { styled } from '@/hocs';

const Container = styled.div`
  &:not(:last-child) {
    border-bottom: 1px solid #dfe3ed;
  }
`;

export default Container;
