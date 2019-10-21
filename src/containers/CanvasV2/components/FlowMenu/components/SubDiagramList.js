import styled from 'styled-components';

import DiagramBlock from './DiagramBlock';

const SubDiagramList = styled.div`
  ${DiagramBlock} {
    padding-left: ${({ depth = 0 }) => `${(depth + 1) * 14 + 18}px`};

    &::before {
      position: absolute;
      top: 13px;
      left: 14px;
      color: #62778c;
      content: '↳';
      margin-left: ${({ depth = 0 }) => `${depth * 14}px`};

      font-size: 12px;
    }
  }
`;

export default SubDiagramList;
