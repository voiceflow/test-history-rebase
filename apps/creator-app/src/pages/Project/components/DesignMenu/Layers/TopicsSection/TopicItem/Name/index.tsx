import { Nullable, Utils } from '@voiceflow/common';
import { Box, ContextMenu, Dropdown, getNestedMenuFormattedLabel, stopPropagation, System, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import * as Router from '@/ducks/router';
import { useDispatch, useHover, usePermission } from '@/hooks';
import { useDiagramOptions, useDiagramRename } from '@/pages/Project/hooks';
import { withEnterPress, withTargetValue } from '@/utils/dom';

import SearchLabel from '../../../../SearchLabel';
import ItemNameInput from '../../../ItemNameInput';
import * as S from './styles';

export interface TopicItemNameProps {
  name: string;
  isFirst: boolean;
  isSearch: boolean;
  isOpened: boolean;
  isActive: boolean;
  diagramID: string;
  isDragging?: boolean;
  isSubtopic?: boolean;
  onAddIntent: (topicID: string) => void;
  rootTopicID?: string;
  onToggleOpen: (diagramID: string, value?: boolean) => void;
  disableHover?: boolean;
  searchMatchValue: string;
  onCreateSubtopic: (rootTopicID: string) => void;
  isDraggingPreview?: boolean;
  lastCreatedDiagramID: Nullable<string>;
  onClearLastCreatedDiagramID: VoidFunction;
  subtopicDropPreview?: boolean;
}

const TopicItemName = React.forwardRef<HTMLElement, TopicItemNameProps>(
  (
    {
      name,
      isOpened,
      isSearch,
      isActive,
      diagramID,
      isDragging,
      isSubtopic,
      onAddIntent,
      rootTopicID,
      onToggleOpen,
      disableHover,
      searchMatchValue,
      onCreateSubtopic,
      isDraggingPreview,
      lastCreatedDiagramID,
      onClearLastCreatedDiagramID,
      subtopicDropPreview,
    },
    ref
  ) => {
    const [canEditProject] = usePermission(Permission.PROJECT_EDIT);

    const [isHovered, , hoverHandlers] = useHover();
    const [dropdownOpened, setDropdownOpened] = React.useState(false);

    const goToDiagram = useDispatch(Router.goToDiagramHistoryPush);

    const { inputRef, catEdit, localName, onSaveName, setLocalName, renameEnabled, toggleRenameEnabled } = useDiagramRename({
      diagramID,
      autoSelect: true,
      diagramName: name,
      onNameChanged: onClearLastCreatedDiagramID,
    });

    const options = useDiagramOptions({ onRename: toggleRenameEnabled, diagramID, isSubtopic, rootTopicID });

    const isLastCreated = lastCreatedDiagramID === diagramID;

    const onItemClick = () => {
      if (!isActive) {
        goToDiagram(diagramID);
      } else {
        onToggleOpen(diagramID);
      }
    };

    React.useEffect(() => {
      if (!isLastCreated) return;

      toggleRenameEnabled(true);
    }, [isLastCreated]);

    return (
      <ContextMenu options={options} selfDismiss>
        {({ isOpen, onContextMenu }) => (
          <S.Container
            {...hoverHandlers}
            ref={ref as React.Ref<HTMLDivElement>}
            onClick={onItemClick}
            isActive={isActive}
            isHovered={isHovered || dropdownOpened || subtopicDropPreview}
            isDragging={isDragging}
            isSubtopic={isSubtopic}
            disableHover={disableHover}
            onContextMenu={onContextMenu}
            isDraggingPreview={isDraggingPreview}
            isContextMenuOpen={isOpen}
          >
            <Box.FlexApart gap={8} fullWidth>
              <Box.Flex overflow="hidden">
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
                    onKeyPress={withEnterPress((event) => event.currentTarget.blur())}
                  />
                ) : (
                  <S.NameWrapper>{isSearch ? <SearchLabel>{getNestedMenuFormattedLabel(name, searchMatchValue)}</SearchLabel> : name}</S.NameWrapper>
                )}
              </Box.Flex>

              {canEditProject && !renameEnabled && (
                <System.IconButtonsGroup.Base size={System.IconButton.Size.XS}>
                  {isSubtopic ? (
                    <TippyTooltip content="Add intent">
                      <S.AddButton icon="plus" onClick={stopPropagation(() => onAddIntent(diagramID))} />
                    </TippyTooltip>
                  ) : (
                    <Dropdown
                      offset={{ offset: [-4, 8] }}
                      options={[
                        { icon: 'intentSmall', label: 'Add intent', onClick: () => onAddIntent(diagramID) },
                        { icon: 'folderSmall', label: 'Add sub topic', onClick: () => onCreateSubtopic(diagramID) },
                      ]}
                      onClose={() => setDropdownOpened(false)}
                      placement="right-start"
                      selfDismiss
                      inlinePopper
                    >
                      {({ ref, onToggle, isOpen, popper }) => (
                        <S.AddButton
                          ref={ref as React.RefObject<HTMLButtonElement>}
                          icon="plus"
                          active={isOpen}
                          onClick={stopPropagation(Utils.functional.chain(onToggle, () => setDropdownOpened(true)))}
                        >
                          {popper}
                        </S.AddButton>
                      )}
                    </Dropdown>
                  )}
                </System.IconButtonsGroup.Base>
              )}
            </Box.FlexApart>
          </S.Container>
        )}
      </ContextMenu>
    );
  }
);

export default React.memo(TopicItemName);
