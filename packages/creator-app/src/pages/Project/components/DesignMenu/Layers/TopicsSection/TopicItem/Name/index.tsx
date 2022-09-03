import { Nullable } from '@voiceflow/common';
import { ContextMenu, getNestedMenuFormattedLabel, OverflowText, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import * as Router from '@/ducks/router';
import { compose } from '@/hocs';
import { useDispatch, useHover } from '@/hooks';
import { useDiagramOptions, useDiagramRename } from '@/pages/Project/hooks';
import { withEnterPress, withTargetValue } from '@/utils/dom';

import SearchLabel from '../../../../SearchLabel';
import ItemNameContainer from '../../../ItemNameContainer';
import ItemNameInput from '../../../ItemNameInput';
import * as S from './styles';

interface TopicItemNameProps {
  name: string;
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

  const goToDiagram = useDispatch(Router.goToDiagramHistoryPush);

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
          onClick={onItemClick}
          isActive={isActive}
          isHovered={isHovered}
          isDragging={isDragging}
          disableHover={disableHover}
          onContextMenu={onContextMenu}
          isDraggingPreview={isDraggingPreview}
          isContextMenuOpen={isOpen}
        >
          {!isDraggingPreview && (
            <S.IconContainer onClick={stopPropagation(() => onToggleOpen(diagramID))}>
              <S.Icon isOpened={isOpened} />
            </S.IconContainer>
          )}

          {renameEnabled ? (
            <ItemNameInput
              ref={inputRef}
              value={localName}
              onBlur={onSaveName}
              onChange={withTargetValue(setLocalName)}
              readOnly={!catEdit}
              autoFocus
              onKeyPress={withEnterPress((event) => event.currentTarget.blur())}
            />
          ) : (
            <OverflowText paddingY={2}>
              {isSearch ? <SearchLabel>{getNestedMenuFormattedLabel(name, searchMatchValue)}</SearchLabel> : name}
            </OverflowText>
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
