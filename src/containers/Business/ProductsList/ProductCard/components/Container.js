import { styled } from '@/hocs';

const Container = styled.div`
  background-color: #fff;
  border-radius: 5px;
  display: flex;
  padding: 20px;
  margin-bottom: 16px;
  cursor: pointer;
  border: 1px solid #eaeff4;
  transition: background-color 0.12s linear, box-shadow 0.12s linear, border-color 0.12s linear;
  position: relative;
  width: 600px;
  min-height: 170px;

  &:hover {
    border-color: transparent;
    box-shadow: 0 0 1px 1px rgba(17, 49, 96, 0.06), 0 2px 4px 0 rgba(17, 49, 96, 0.12);
  }
`;

export default Container;
