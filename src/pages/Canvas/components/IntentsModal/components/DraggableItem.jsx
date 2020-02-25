import React from 'react';

import Section, { Header, HeaderLabel } from '@/components/Section';
import { css, styled } from '@/hocs';

const IntentSection = styled(Section)`
  ${HeaderLabel} {
    font-weight: ${({ active }) => (active ? '600' : 'normal')};
  }
  ${Header} {
    padding: 12px 32px;
  }

  ${({ active }) =>
    active &&
    css`
      background-color: #eef4f6bd;
    `}
`;

const DraggableItem = ({ item, isDragging, isDraggingPreview, selectedIntentID, setSelectedIntentID, onContextMenu, isContextMenuOpen }, ref) => {
  return (
    <IntentSection
      ref={ref}
      header={item.name}
      active={selectedIntentID === item.id}
      count={item.inputs?.length}
      isDragging={isDragging}
      isDraggingPreview={isDraggingPreview}
      onClick={() => setSelectedIntentID(item.id)}
      onContextMenu={onContextMenu}
      isContextMenuOpen={isContextMenuOpen}
    />
  );
};

export default React.forwardRef(DraggableItem);
