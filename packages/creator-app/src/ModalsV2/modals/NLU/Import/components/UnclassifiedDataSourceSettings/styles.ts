import { styled } from '@/hocs/styled';

export const UtteranceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
  justify-content: space-between;

  &:last-child {
    margin-bottom: 0;
  }
`;
