import { getNestedMenuFormattedLabel, OverflowText, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import ContextMenu from '@/components/ContextMenu';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import { useDiagramOptions, useDiagramRename } from '@/pages/Skill/hooks';
import { Nullable } from '@/types';
import { getTargetValue, withEnterPress } from '@/utils/dom';
import { compose } from '@/utils/functional';

import SearchLabel from './SearchLabel';
import TopicItemNameContainer from './TopicItemNameContainer';
import TopicNameIcon from './TopicNameIcon';
import TopicNameIconContainer from './TopicNameIconContainer';
import TopicNameInput from './TopicNameInput';

interface TopicItemNameProps {
  name: string;
  isRoot: boolean;
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
  const goToDiagram = useDispatch(Router.goToDiagramHistoryPush);

  const { inputRef, catEdit, localName, onSaveName, setLocalName, renameEnabled, toggleRenameEnabled } = useDiagramRename({
    diagramID,
    autoSelect: true,
    diagramName: name,
    onNameChanged: onClearLastCreatedDiagramID,
  });

  const isLastCreated = lastCreatedDiagramID === diagramID;

  React.useEffect(() => {
    if (isLastCreated) {
      toggleRenameEnabled(true);
    }
  }, [isLastCreated]);

  const options = useDiagramOptions({ onRename: toggleRenameEnabled, diagramID });

  const onItemClick = () => {
    if (!isActive) {
      goToDiagram(diagramID);
    } else {
      onToggleOpen(diagramID);
    }
  };

  return (
    <ContextMenu options={options} stopItemPropagation={false}>
      {({ isOpen, onContextMenu }) => (
        <TopicItemNameContainer
          ref={ref}
          onClick={onItemClick}
          isActive={isActive}
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
            <TopicNameInput
              ref={inputRef}
              value={localName}
              onBlur={onSaveName}
              onChange={getTargetValue(setLocalName)}
              readOnly={!catEdit}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              onKeyPress={withEnterPress((event) => event.currentTarget.blur())}
            />
          ) : (
            <OverflowText>{isSearch ? <SearchLabel>{getNestedMenuFormattedLabel(name, searchMatchValue)}</SearchLabel> : name}</OverflowText>
          )}
        </TopicItemNameContainer>
      )}
    </ContextMenu>
  );
};

// eslint-disable-next-line xss/no-mixed-html
export default compose(
  React.memo,
  React.forwardRef
)(TopicItemName as React.ForwardRefExoticComponent<React.PropsWithoutRef<TopicItemNameProps> & React.RefAttributes<HTMLElement>>);
