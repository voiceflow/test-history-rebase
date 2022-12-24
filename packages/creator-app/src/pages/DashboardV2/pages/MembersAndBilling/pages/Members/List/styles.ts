import { Input as UIInput, Table } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const Container = styled(Table.Container)`
  border: #eaeff4 solid 1px;
  border-radius: 8px;
  overflow: hidden;
  min-width: auto;
`;

export const Header = styled.header`
  background-color: #eef4f6;
  padding: 16px 32px 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const Filters = styled.section`
  background-color: #eef4f6;
  display: flex;
  flex-direction: row;
  gap: 12px;
  justify-content: space-between;
`;

export const Input = styled(UIInput)`
  width: 230px;
`;

export const Body = styled.div`
  border-top: 1px solid #eaeff4;
`;

export const NoResults = styled.div`
  height: 84px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #eaeff4;
`;
