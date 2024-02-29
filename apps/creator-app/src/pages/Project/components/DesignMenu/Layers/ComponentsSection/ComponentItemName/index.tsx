import { Nullable, Utils } from '@voiceflow/common';
import { compose, ContextMenu, getNestedMenuFormattedLabel, OverflowText, SvgIconTypes, useEnableDisable, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import * as Router from '@/ducks/router';
import { useDispatch, useHover, usePermission } from '@/hooks';
import { useDiagramOptions, useDiagramRename } from '@/pages/Project/hooks';
import { withEnterPress, withTargetValue } from '@/utils/dom';

import SearchLabel from '../../../SearchLabel';
import ItemNameIcon from '../../ItemNameIcon';
import ItemNameInput from '../../ItemNameInput';
import * as S from './styles';

interface ComponentItemNameNameProps {
  icon: SvgIconTypes.Icon;
  name: string;
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
    icon,
    name,
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
  const [hasTCEditPermissions] = usePermission(Permission.REORDER_TOPICS_AND_COMPONENTS);
  const goToDiagram = useDispatch(Router.goToDiagramHistoryClear);

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
        <S.ComponentItemNameContainer
          {...hoverHandlers}
          ref={ref}
          isActive={isActive}
          isHovered={!!isHovered}
          isClicked={isClickedState}
          onMouseUp={clearClickedState}
          isDragging={isDragging}
          onMouseDown={() => hasTCEditPermissions && enableClickedState()}
          disableHover={disableHover}
          viewerOnly={!hasTCEditPermissions}
          onClick={() => !renameEnabled && goToDiagram(diagramID)}
          onContextMenu={Utils.functional.chain(onContextMenu, clearClickedState)}
          isDraggingPreview={isDraggingPreview}
          isContextMenuOpen={isOpen}
          isDraggingXEnabled={isDraggingXEnabled}
        >
          {!isDragging && (
            <>
              <S.IconContainer>
                <ItemNameIcon icon={icon} size={18} />
              </S.IconContainer>

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
                <>
                  <OverflowText>{isSearch ? <SearchLabel>{getNestedMenuFormattedLabel(name, searchMatchValue)}</SearchLabel> : name}</OverflowText>
                </>
              )}
            </>
          )}
        </S.ComponentItemNameContainer>
      )}
    </ContextMenu>
  );
};

// eslint-disable-next-line xss/no-mixed-html
export default compose(
  React.memo,
  React.forwardRef
)(ComponentItemName as React.ForwardRefExoticComponent<React.PropsWithoutRef<ComponentItemNameNameProps> & React.RefAttributes<HTMLElement>>);
