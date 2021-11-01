import { getNestedMenuFormattedLabel, OverflowText, SvgIcon, useEnableDisable, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import ContextMenu from '@/components/ContextMenu';
import * as Router from '@/ducks/router';
import { useDispatch, useHover } from '@/hooks';
import { useDiagramOptions, useDiagramRename } from '@/pages/Project/hooks';
import { Nullable } from '@/types';
import { getTargetValue, withEnterPress } from '@/utils/dom';
import { chain, compose } from '@/utils/functional';

import ItemNameInput from '../../ItemNameInput';
import SearchLabel from '../../SearchLabel';
import ComponentItemNameContainer from './ComponentItemNameContainer';

export { ITEM_HEIGHT as COMPONENT_ITEM_HEIGHT } from '../../ItemNameContainer';

interface ComponentItemNameNameProps {
  name: string;
  isFirst?: boolean;
  isSearch: boolean;
  isActive: boolean;
  diagramID: string;
  isDragging?: boolean;
  disableHover?: boolean;
  searchMatchValue: string;
  isDraggingPreview?: boolean;
  isDraggingXEnabled?: boolean;
  lastCreatedDiagramID: Nullable<string>;
  onClearLastCreatedDiagramID: VoidFunction;
}

const ComponentItemName: React.ForwardRefRenderFunction<HTMLDivElement, ComponentItemNameNameProps> = (
  {
    name,
    isFirst,
    isSearch,
    isActive,
    diagramID,
    isDragging,
    disableHover,
    searchMatchValue,
    isDraggingPreview,
    isDraggingXEnabled,
    lastCreatedDiagramID,
    onClearLastCreatedDiagramID,
  },
  ref
) => {
  const [isHovered, , hoverHandlers] = useHover();
  const [isClickedState, enableClickedState, clearClickedState] = useEnableDisable();

  const goToDiagram = useDispatch(Router.goToDiagramHistoryPush);

  const { inputRef, catEdit, localName, onSaveName, setLocalName, renameEnabled, toggleRenameEnabled } = useDiagramRename({
    diagramID,
    autoSelect: true,
    diagramName: name,
    onNameChanged: onClearLastCreatedDiagramID,
  });

  const onEdit = usePersistFunction(() => goToDiagram(diagramID));

  const options = useDiagramOptions({ onEdit, onRename: toggleRenameEnabled, diagramID });

  const isLastCreated = lastCreatedDiagramID === diagramID;

  React.useEffect(() => {
    if (isLastCreated) {
      toggleRenameEnabled(true);
    }
  }, [isLastCreated]);

  React.useEffect(() => {
    if (isDragging) {
      clearClickedState();
    }
  }, [isDragging]);

  return (
    <ContextMenu options={options} selfDismiss>
      {({ isOpen, onContextMenu }) => (
        <ComponentItemNameContainer
          {...hoverHandlers}
          ref={ref}
          isFirst={isFirst}
          isActive={isActive}
          isHovered={isHovered}
          isClicked={isClickedState}
          onMouseUp={clearClickedState}
          isDragging={isDragging}
          onMouseDown={enableClickedState}
          disableHover={disableHover}
          onDoubleClick={onEdit}
          onContextMenu={chain(onContextMenu, clearClickedState)}
          isDraggingPreview={isDraggingPreview}
          isContextMenuOpen={isOpen}
          isDraggingXEnabled={isDraggingXEnabled}
        >
          {!isDragging && (
            <>
              {renameEnabled ? (
                <ItemNameInput
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
                <>
                  <OverflowText width="100%">
                    {isSearch ? <SearchLabel>{getNestedMenuFormattedLabel(name, searchMatchValue)}</SearchLabel> : name}
                  </OverflowText>

                  <SvgIcon icon="dotsGroup" size={14} color="#becedc" />
                </>
              )}
            </>
          )}
        </ComponentItemNameContainer>
      )}
    </ContextMenu>
  );
};

// eslint-disable-next-line xss/no-mixed-html
export default compose(
  React.memo,
  React.forwardRef
)(ComponentItemName as React.ForwardRefExoticComponent<React.PropsWithoutRef<ComponentItemNameNameProps> & React.RefAttributes<HTMLElement>>);
