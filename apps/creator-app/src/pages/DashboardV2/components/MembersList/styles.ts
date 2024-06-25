import { Input as UIInput, Table } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const Container = styled(Table.Container)`
  box-shadow:
    rgba(17, 49, 96, 0.1) 0px 0px 0px 1px,
    rgba(17, 49, 96, 0.08) 0px 1px 3px 0px;
  border-radius: 8px;
  overflow: hidden;
  min-width: auto;
`;

export const Header = styled.header`
  background-color: rgba(237, 243, 245, 0.65);
  padding: 16px 32px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const Filters = styled.section`
  display: flex;
  flex-direction: row;
  gap: 11px;
  justify-content: space-between;
`;

export const Input = styled(UIInput)`
  width: 230px;
`;

export const Body = styled.div`
  border-top: 1px solid #eaeff4;
`;

export const NoResults = styled.div`
  height: 76px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
