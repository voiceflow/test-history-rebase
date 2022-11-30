import { Table } from '@voiceflow/ui';

import { styled } from '@/hocs';

import { StyledSVG } from './components/styles';

export const Container = styled(Table.Container)`
  box-shadow: rgba(17, 49, 96, 0.1) 0px 0px 0px 1px, rgba(17, 49, 96, 0.08) 0px 1px 3px 0px;
  border-radius: 8px;
  overflow: hidden;
  min-width: auto;
`;

export const Header = styled.header`
  background-color: rgba(237, 243, 245, 0.65);
  border-bottom: #eaeff4 solid 1px;
  padding: 16px 32px 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const Filters = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const Actions = styled.section`
  background-color: #eef4f6;
`;

export const Row = styled(Table.Row)`
  padding-top: 23px;
  padding-bottom: 23px;
  cursor: auto;

  &:hover {
    background-color: #fff;

    ${StyledSVG} {
      opacity: 1;
    }
  }
`;

export const Cell = styled.div``;
