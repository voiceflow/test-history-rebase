import { styled } from '@/hocs';

import MemberIcon from './MemberIcon';

const AddMemberIcon = styled(MemberIcon)`
  line-height: 24px;

  &:before {
    border-style: dashed;
    border-color: #becedc;
  }

  &:hover {
    color: rgb(141, 162, 181) !important;
    cursor: pointer;

    &:before {
      border-color: rgb(141, 162, 181);
    }
  }
`;

export default AddMemberIcon;
