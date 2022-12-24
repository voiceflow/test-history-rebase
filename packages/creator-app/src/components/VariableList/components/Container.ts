import { styled } from '@/hocs/styled';

const Container = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-bottom: 0;

  > li {
    display: flex;
    gap: 16px;
    align-items: center;
  }
`;

export default Container;
