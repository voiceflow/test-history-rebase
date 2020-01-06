import { styled } from '@/hocs';

const MembersContainer = styled.div`
  display: flex;
  margin-left: 22px;
  z-index: 0;

  & > div {
    margin-right: 12px;

    :last-child {
      margin-right: 0;
    }
  }
`;

export default MembersContainer;
