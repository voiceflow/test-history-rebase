import { styled } from '@/hocs';

const MembersWrapper = styled.div`
  display: flex;
  margin-left: 5px;

  & > div {
    margin-left: -5px;
  }
`;

export default MembersWrapper;
