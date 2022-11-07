import { MemberIcon } from '@ui/components/User';
import { styled } from '@ui/styles';

const AddMemberIcon = styled(MemberIcon)`
  width: 30px;
  height: 30px;
  color: #8da2b580;
  line-height: 30px;
  background-color: transparent;
  border: 1px dashed #8da2b580;
  box-shadow: none;

  &:hover {
    color: #8da2b5;
    border: 1px dashed #8da2b5;
    cursor: pointer;
  }
`;

export default AddMemberIcon;
