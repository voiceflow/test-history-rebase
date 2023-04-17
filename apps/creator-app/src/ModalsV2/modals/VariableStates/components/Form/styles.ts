import { styled } from '@/hocs/styled';

export const InputHint = styled.span`
  color: #62778c;
  font-size: 13px;
  padding-top: 12px;
  display: inline-flex;
`;

export const ListSection = styled.div`
  max-height: calc(100vh - 536px);
  min-height: 40px;
  overflow: scroll;
  overflow-x: hidden;
  padding: 16px 32px 32px;

  &::-webkit-scrollbar {
    width: 0;
  }
`;
