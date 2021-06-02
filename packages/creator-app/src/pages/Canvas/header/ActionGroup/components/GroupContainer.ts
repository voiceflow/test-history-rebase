import { styled } from '@/hocs';

const GroupContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: inherit;
  padding: 0 24px;
  border-left: 1px solid #eaeff4;

  :last-child {
    padding-right: 0;
  }
`;

export default GroupContainer;
