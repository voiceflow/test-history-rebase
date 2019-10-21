import { Link } from 'react-router-dom';

import { styled, transition } from '@/hocs';

const NewBoardTab = styled(Link)`
  display: flex;
  padding: 10px 20px;
  align-items: center;
  color: #949db0;
  font-weight: 600;
  ${transition()}

  & > :first-child {
    margin-right: 10px;
  }

  &:hover {
    color: #848da0;
    text-decoration: none;
  }
`;

export default NewBoardTab;
