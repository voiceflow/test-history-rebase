import { styled } from '@/hocs';

export const ActionRow = styled.div`
  display: flex;

  & > *:not(:last-child) {
    margin-right: 10px;
  }

  padding-right: 16px;
`;
