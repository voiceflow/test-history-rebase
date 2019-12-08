import { styled } from '@/hocs';

import MemberIcon from './MemberIcon';

const AddMemberIcon = styled(MemberIcon)`
  line-height: 28px;
  border-color: #becedc;
  border-style: dashed;

  &:hover {
    border-color: rgb(141, 162, 181);
    color: rgb(141, 162, 181) !important;
    cursor: pointer;
  }
`;

export default AddMemberIcon;
