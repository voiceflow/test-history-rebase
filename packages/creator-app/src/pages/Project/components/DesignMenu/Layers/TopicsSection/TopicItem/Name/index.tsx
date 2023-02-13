import { Nullable, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, ContextMenu, Dropdown, getNestedMenuFormattedLabel, OverflowText, stopPropagation, System, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import * as Router from '@/ducks/router';
import { useDispatch, useFeature, useHover } from '@/hooks';
import { useDiagramOptions, useDiagramRename } from '@/pages/Project/hooks';
import { withEnterPress, withTargetValue } from '@/utils/dom';

import SearchLabel from '../../../../SearchLabel';
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
  isSubtopic?: boolean;
  onAddIntent: (topicID: string) => void;
  rootTopicID?: string;
  onToggleOpen: (diagramID: string, value?: boolean) => void;
  disableHover?: boolean;
  searchMatchValue: string;
  onCreateSubtopic: (rootTopicID: string) => void;
  isDraggingPreview?: boolean;
  lastCreatedTopicID: Nullable<string>;
  onClearLastCreatedTopicID: VoidFunction;
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
      lastCreatedTopicID,
      onClearLastCreatedTopicID,
    },
    ref
  ) => {
    const subtopicsFeature = useFeature(Realtime.FeatureFlag.SUBTOPICS);

    const [isHovered, , hoverHandlers] = useHover();
    const [dropdownOpened, setDropdownOpened] = React.useState(false);

    const goToDiagram = useDispatch(Router.goToDiagramHistoryPush);

    const { inputRef, catEdit, localName, onSaveName, setLocalName, renameEnabled, toggleRenameEnabled } = useDiagramRename({
      diagramID,
      autoSelect: true,
      diagramName: name,
      onNameChanged: onClearLastCreatedTopicID,
    });

    const options = useDiagramOptions({ onRename: toggleRenameEnabled, diagramID, isSubtopic, rootTopicID });

    const isLastCreated = lastCreatedTopicID === diagramID;

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
            isHovered={isHovered || dropdownOpened}
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
                  <OverflowText paddingY={2}>
                    {isSearch ? <SearchLabel>{getNestedMenuFormattedLabel(name, searchMatchValue)}</SearchLabel> : name}
                  </OverflowText>
                )}
              </Box.Flex>

              {subtopicsFeature.isEnabled && (
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
