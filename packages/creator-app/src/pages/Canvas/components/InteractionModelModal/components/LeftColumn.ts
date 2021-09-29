import DeleteComponentWrapper from '@/components/DraggableList/components/DeleteComponentWrapper';
import { WindowScrollerContainer } from '@/components/VirtualList/components';
import { css, styled } from '@/hocs';

const LeftColumn = styled.div<{ isDragging?: boolean }>`
  position: relative;
  width: 300px;
  height: 100%;
  border-right: solid 1px #e3e9ec;

  ${WindowScrollerContainer} {
    padding: 10px 0;

    ${({ isDragging }) =>
      isDragging &&
      css`
        padding-bottom: 120px;
      `}
  }

  ${DeleteComponentWrapper} {
    bottom: 56px;
    border-bottom: none;
    background-color: #fff;
  }
`;

export default LeftColumn;
