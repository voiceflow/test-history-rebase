import { styled } from '@/hocs';

const ResultsTable = styled.table`
  margin-bottom: 0px;
  table-layout: fixed;
  overflow: hidden;
  width: 100%;

  thead th {
    border-bottom: 1px solid rgba(226, 233, 236, 0.63);
  }

  th {
    font-weight: 500;
    font-size: 13px;
    color: #62778c;
  }

  th,
  td {
    padding: 0.75rem;
  }
`;

export default ResultsTable;
