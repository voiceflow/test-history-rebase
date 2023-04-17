import { styled } from '@/hocs/styled';

const Container = styled.div`
  &:not(:last-child) {
    border-bottom: 1px solid #dfe3ed;
  }
`;

export default Container;
