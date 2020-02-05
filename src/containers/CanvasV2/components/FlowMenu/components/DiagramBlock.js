import styled from 'styled-components';

import DiagramEdit from './DiagramEdit';

const DiagramBlock = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  width: 100%;
  height: 42px;

  &:hover {
    ${DiagramEdit} {
      opacity: 0.5;
    }
  }
`;

export default DiagramBlock;
