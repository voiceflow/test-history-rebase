import { Nullable } from '@voiceflow/common';
import { getNestedMenuFormattedLabel, OverflowText, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import ContextMenu from '@/components/ContextMenu';
import * as Router from '@/ducks/router';
import { compose } from '@/hocs';
import { useDispatch, useHover } from '@/hooks';
import { useDiagramOptions, useDiagramRename } from '@/pages/Project/hooks';
import { withEnterPress, withTargetValue } from '@/utils/dom';

import ItemNameContainer from '../../ItemNameContainer';
import ItemNameInput from '../../ItemNameInput';
import SearchLabel from '../../SearchLabel';
import TopicNameIcon from './TopicNameIcon';
import TopicNameIconContainer from './TopicNameIconContainer';

export { ITEM_HEIGHT as TOPIC_ITEM_HEIGHT } from '../../ItemNameContainer';

interface TopicItemNameProps {
  name: string;
  isRoot: boolean;
  isFirst: boolean;
  isSearch: boolean;
  isOpened: boolean;
  isActive: boolean;
  diagramID: string;
  isDragging?: boolean;
  onToggleOpen: (diagramID: string) => void;
  disableHover?: boolean;
  searchMatchValue: string;
  isDraggingPreview?: boolean;
  lastCreatedDiagramID: Nullable<string>;
  onClearLastCreatedDiagramID: VoidFunction;
}

const TopicItemName: React.ForwardRefRenderFunction<HTMLDivElement, TopicItemNameProps> = (
  {
    name,
    isRoot,
    isFirst,
    isOpened,
    isSearch,
    isActive,
    diagramID,
    isDragging,
    onToggleOpen,
    disableHover,
    searchMatchValue,
    isDraggingPreview,
    lastCreatedDiagramID,
    onClearLastCreatedDiagramID,
  },
  ref
) => {
  const [isHovered, , hoverHandlers] = useHover();

  const goToDiagram = useDispatch(Router.goToDiagramHistoryClear);

  const { inputRef, catEdit, localName, onSaveName, setLocalName, renameEnabled, toggleRenameEnabled } = useDiagramRename({
    diagramID,
    autoSelect: true,
    diagramName: name,
    onNameChanged: onClearLastCreatedDiagramID,
  });

  const options = useDiagramOptions({ onRename: toggleRenameEnabled, diagramID });

  const isLastCreated = lastCreatedDiagramID === diagramID;

  const onItemClick = () => {
    if (!isActive) {
      goToDiagram(diagramID);
    } else {
      onToggleOpen(diagramID);
    }
  };

  React.useEffect(() => {
    if (isLastCreated) {
      toggleRenameEnabled(true);
    }
  }, [isLastCreated]);

  return (
    <ContextMenu options={options} selfDismiss>
      {({ isOpen, onContextMenu }) => (
        <ItemNameContainer
          {...hoverHandlers}
          ref={ref}
          isFirst={isFirst}
          onClick={onItemClick}
          isActive={isActive}
          isHovered={isHovered}
          isDragging={isDragging}
          disableHover={disableHover}
          onContextMenu={isRoot ? undefined : onContextMenu}
          isDraggingPreview={isDraggingPreview}
          isContextMenuOpen={isOpen}
        >
          {!isDraggingPreview && (
            <TopicNameIconContainer onClick={stopPropagation(() => onToggleOpen(diagramID))}>
              <TopicNameIcon isOpened={isOpened} isActive={isActive} />
            </TopicNameIconContainer>
          )}

          {renameEnabled ? (
            <ItemNameInput
              ref={inputRef}
              value={localName}
              onBlur={onSaveName}
              onChange={withTargetValue(setLocalName)}
              readOnly={!catEdit}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              onKeyPress={withEnterPress((event) => event.currentTarget.blur())}
            />
          ) : (
            <OverflowText>{isSearch ? <SearchLabel>{getNestedMenuFormattedLabel(name, searchMatchValue)}</SearchLabel> : name}</OverflowText>
          )}
        </ItemNameContainer>
      )}
    </ContextMenu>
  );
};

// eslint-disable-next-line xss/no-mixed-html
export default compose(
  React.memo,
  React.forwardRef
)(TopicItemName as React.ForwardRefExoticComponent<React.PropsWithoutRef<TopicItemNameProps> & React.RefAttributes<HTMLElement>>);
