import DeleteComponentWrapper from '@/components/DraggableList/components/DeleteComponentWrapper';
import { WindowScrollerContainer } from '@/components/SearchableList/components';
import { styled } from '@/hocs';

import { CONTENT_HEIGHT } from '../constants';

const LeftColumn = styled.div`
  width: 300px;
  height: ${CONTENT_HEIGHT}px;
  border-right: solid 1px #e3e9ec;

  ${WindowScrollerContainer} {
    padding: 10px 0;
  }

  ${DeleteComponentWrapper} {
    bottom: 56px;
    border-bottom: none;
    background-color: #fff;
  }
`;

export default LeftColumn;
