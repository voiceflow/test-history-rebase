import { Table } from 'reactstrap';

import { styled } from '@/hocs';

const ResultsTable = styled(Table)`
  margin-bottom: 0px;
  table-layout: fixed;
  overflow: hidden;

  th {
    font-weight: 500;
    font-size: 13px;
    color: #62778c;
  }
`;

export default ResultsTable;
