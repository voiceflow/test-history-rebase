import { styled } from '@/hocs/styled';

export const TabsContainer = styled.div`
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 22px;
  border-radius: 8px 8px 0px 0px;
  background-color: ${({ theme }) => theme.components.sectionV2.accentBackground};
`;

export const SearchContainer = styled.div`
  padding-left: 22px;
  padding-right: 22px;
`;

export const FilledListContainer = styled.div`
  padding: 6px;
  max-height: 350px;
  overflow: auto;
`;

export const EmptyListContainer = styled.div`
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 22px;
`;
