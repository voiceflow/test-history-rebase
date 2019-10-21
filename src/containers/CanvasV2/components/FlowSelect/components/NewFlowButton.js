import { styled } from '@/hocs';

const NewFlowButton = styled.div`
  padding: 12px;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  border: 1px solid #e2e9ec;
  border-radius: 5px;
  color: #8da2b5;
  transition: all 0.25s;
  font-size: 15px;
  cursor: pointer;

  & > span {
    margin-right: 10px;
  }
`;

export default NewFlowButton;
