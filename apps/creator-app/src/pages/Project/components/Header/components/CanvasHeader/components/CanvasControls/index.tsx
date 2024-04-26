import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Dropdown, stopPropagation, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import { BlockType } from '@/constants';
import { Permission } from '@/constants/permissions';
import { SearchContext } from '@/contexts/SearchContext';
import { Designer } from '@/ducks';
import { usePermission, useSelector } from '@/hooks';
import { Hotkey, HOTKEY_LABEL_MAP } from '@/keymap';
import { MarkupContext } from '@/pages/Project/contexts';
import { useCommentingMode, useCommentingToggle, useDisableModes } from '@/pages/Project/hooks';
import { ClassName } from '@/styles/constants';

import { MoveTypePopover } from './components';

const CanvasHeader: React.FC = () => {
  const markup = React.useContext(MarkupContext)!;

  const hasUnreadComments = useSelector(Designer.Thread.selectors.hasUnreadComments);

  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);
  const [canUseHintFeatures] = usePermission(Permission.CANVAS_HINT_FEATURES);

  const onDisableModes = useDisableModes();
  const isCommentingMode = useCommentingMode();
  const onToggleCommenting = useCommentingToggle();

  const isMarkupTextActive = markup.creatingType === BlockType.MARKUP_TEXT;
  const isMarkupMediaActive = Realtime.Utils.typeGuards.isMarkupMediaBlockType(markup.creatingType);

  const search = React.useContext(SearchContext);

  return (
    <>
      <Box.Flex gap={8} mr={24}>
        <Dropdown menu={(onToggle) => <MoveTypePopover closePopover={onToggle} />}>
          {({ ref, onToggle, isOpen }) => (
            <Page.Header.IconButton
              ref={ref}
              icon="cursorV2"
              active={!isMarkupTextActive && !isMarkupMediaActive && !isCommentingMode}
              onClick={onDisableModes}
              tooltip={{
                content: (
                  <TippyTooltip.WithHotkey hotkey={HOTKEY_LABEL_MAP[Hotkey.MOVE_MODE]}>Move</TippyTooltip.WithHotkey>
                ),
                offset: [0, -6],
              }}
              expandable
              expandActive={isOpen}
              expandTooltip={{ content: 'Move type', offset: [0, 32] }}
              onExpandClick={stopPropagation(onToggle)}
            />
          )}
        </Dropdown>

        {canUseHintFeatures && canEditCanvas && (
          <Page.Header.IconButton
            icon="note"
            active={isMarkupTextActive}
            tooltip={{
              content: (
                <TippyTooltip.WithHotkey hotkey={HOTKEY_LABEL_MAP[Hotkey.ADD_MARKUP_NOTE]}>
                  Note
                </TippyTooltip.WithHotkey>
              ),
              offset: [0, -6],
            }}
            onClick={markup.toggleTextCreating}
            className={`${ClassName.CANVAS_CONTROL}--markup-text`}
          />
        )}

        {canUseHintFeatures && canEditCanvas && (
          <Page.Header.IconButton
            icon="systemImage"
            active={isMarkupMediaActive}
            onClick={markup.triggerMediaUpload}
            tooltip={{
              content: (
                <TippyTooltip.WithHotkey hotkey={HOTKEY_LABEL_MAP[Hotkey.ADD_MARKUP_IMAGE]}>
                  Image or Video
                </TippyTooltip.WithHotkey>
              ),
              offset: [0, -6],
            }}
            iconProps={{ size: 18 }}
            className={`${ClassName.CANVAS_CONTROL}--markup-image`}
          />
        )}

        {canUseHintFeatures && (
          <Page.Header.IconButton
            icon="commentV2"
            active={isCommentingMode}
            tooltip={{
              content: (
                <TippyTooltip.WithHotkey hotkey={HOTKEY_LABEL_MAP[Hotkey.OPEN_COMMENTING]}>
                  Comment
                </TippyTooltip.WithHotkey>
              ),
              offset: [0, -6],
            }}
            onClick={onToggleCommenting}
            className={`${ClassName.CANVAS_CONTROL}--commenting`}
            withBadge={hasUnreadComments}
          />
        )}

        <Page.Header.IconButton
          icon="search"
          active={search?.isVisible}
          onClick={() => search?.toggle()}
          tooltip={{
            content: (
              <TippyTooltip.WithHotkey hotkey={HOTKEY_LABEL_MAP[Hotkey.SEARCH]}>
                Search Assistant
              </TippyTooltip.WithHotkey>
            ),
            offset: [0, -6],
          }}
        />
      </Box.Flex>
    </>
  );
};

export default CanvasHeader;
