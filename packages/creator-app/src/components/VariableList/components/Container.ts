import { styled } from '@/hocs';

const Container = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;

  > li {
    display: flex;
    gap: 16px;
    align-items: center;
  }
`;

export default Container;
