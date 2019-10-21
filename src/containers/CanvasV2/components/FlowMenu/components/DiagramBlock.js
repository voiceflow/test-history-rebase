import styled from 'styled-components';

import DiagramButton from './DiagramButton';
import DiagramEdit from './DiagramEdit';

const DiagramBlock = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  width: 100%;
  height: 42px;
  padding-right: 8px;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;

  background: #fff;
  transition: background 0.15s ease !important;

  &.active {
    background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, #eef4f6 100%), #ffffff !important;
    border-top: 1px solid #dfe3ed;
    border-bottom: 1px solid #dfe3ed;

    ${DiagramButton} {
      color: #132144;
    }
  }

  &:hover {
    background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, #eff5f7 100%), #ffffff;

    ${DiagramEdit} {
      opacity: 1;
    }
  }
`;

export default DiagramBlock;
