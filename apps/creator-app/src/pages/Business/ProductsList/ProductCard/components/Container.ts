import { styled } from '@/hocs/styled';

const Container = styled.div`
  position: relative;
  display: flex;
  width: 600px;
  margin-bottom: 16px;
  padding: 23px 32px 24px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 1px 1px rgba(17, 49, 96, 0.08), 0 1px 3px 0 rgba(17, 49, 96, 0.08);
  cursor: pointer;
  transition: background-color 0.12s linear, box-shadow 0.12s linear, border-color 0.12s linear;

  &:hover {
    box-shadow: 0 0 1px 1px rgba(17, 49, 96, 0.08), 0 4px 8px 0 rgba(17, 49, 96, 0.16);
  }
`;

export default Container;
