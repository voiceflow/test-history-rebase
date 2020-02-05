import { styled } from '@/hocs';

const Container = styled.div`
  background-color: #fff;
  border-radius: 5px;
  display: flex;
  padding: 23px 32px 24px;
  margin-bottom: 16px;
  cursor: pointer;
  box-shadow: 0 0 1px 1px rgba(17, 49, 96, 0.08), 0 1px 3px 0 rgba(17, 49, 96, 0.08);
  transition: background-color 0.12s linear, box-shadow 0.12s linear, border-color 0.12s linear;
  position: relative;
  width: 600px;

  &:hover {
    box-shadow: 0 0 1px 1px rgba(17, 49, 96, 0.08), 0 4px 8px 0 rgba(17, 49, 96, 0.16);
  }
`;

export default Container;
