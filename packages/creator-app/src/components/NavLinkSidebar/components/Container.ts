import { styled } from '@/hocs/styled';

const Container = styled.div`
  width: 248px;
  background-color: #fff;
  border-right: 1px solid ${({ theme }) => theme.colors.borders};
  height: 100%;
  padding: 24px 0;
  overflow-y: auto;
`;

export default Container;
