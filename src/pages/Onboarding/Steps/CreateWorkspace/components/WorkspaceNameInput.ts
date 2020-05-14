import Input from '@/components/Input';
import { styled } from '@/hocs';

const WorkspaceNameInput = styled(Input)`
  border: none;
  text-align: center;
  border-bottom: 1px solid #dfe3ed;
  box-shadow: none;
  border-radius: 0;
  font-size: 18px;
  margin-bottom: 40px;
  line-height: normal;

  ::placeholder {
    color: #8da2b5 !important;
    font-size: 18px !important;
    line-height: normal;
  }

  :focus {
    box-shadow: none;
    border: none;
    border-bottom: 1px solid #5d9df5;
  }
`;

export default WorkspaceNameInput;
