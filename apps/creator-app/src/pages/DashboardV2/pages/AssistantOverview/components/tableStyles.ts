import { Box, System, Table } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const Container = styled(Table.Container)`
  box-shadow: rgba(17, 49, 96, 0.1) 0px 0px 0px 1px, rgba(17, 49, 96, 0.08) 0px 1px 3px 0px;
  border-radius: 8px;
  overflow: hidden;
  min-width: auto;
`;

export const Header = styled(Box.FlexApart)`
  padding: 16px 32px 15px;
  border-bottom: #eaeff4 solid 1px;
  background-color: rgba(237, 243, 245, 0.65);
`;

export const Actions = styled.section`
  background-color: #eef4f6;
`;

export const Row = styled(Table.Row)`
  height: 68px;
  padding-top: 0;
  padding-bottom: 0;

  ${Table.Column} {
    .vf-tooltip {
      width: 100%;
    }
  }
`;

export const NameCell = styled(System.Link.Button)`
  align-items: center;
  height: 68px;
  display: flex;
  width: 100%;

  b {
    text-decoration: underline;
  }
`;
