import { styled } from '@/hocs/styled';

export const GroupsContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: 20px;
  height: 100%;
  width: 100%;
  flex-direction: column;
  padding: 16px 0;
`;

export const Group = styled.div`
  width: 100%;
  padding: 0 16px;
`;

export const FillSpace = styled.div`
  flex: 1;
`;
