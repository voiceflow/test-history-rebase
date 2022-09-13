import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Dropdown, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { HeaderIconButton } from '@/components/ProjectPage';
import { Permission } from '@/config/permissions';
import { BlockType, ModalType } from '@/constants';
import * as Thread from '@/ducks/threadV2';
import { useFeature, useModals, usePermission, useSelector, useTrackingEvents } from '@/hooks';
import { Hotkey, HOTKEY_LABEL_MAP } from '@/keymap';
import { MarkupContext } from '@/pages/Project/contexts';
import { useCommentingMode, useCommentingToggle, useDisableModes } from '@/pages/Project/hooks';
import { ClassName } from '@/styles/constants';

import { MoveTypePopover, StickersDropdown } from './components';

const CanvasHeader: React.FC = () => {
  const markup = React.useContext(MarkupContext)!;

  const hasUnreadComments = useSelector(Thread.hasUnreadCommentsSelector);

  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const [canUseHintFeatures] = usePermission(Permission.HINT_FEATURES);

  const onDisableModes = useDisableModes();
  const isCommentingMode = useCommentingMode();
  const onToggleCommenting = useCommentingToggle();

  const [, trackingEventsWrapper] = useTrackingEvents();

  const stickersDropdown = useFeature(Realtime.FeatureFlag.STICKERS_DROPDOWN);

  const nluQuickView = useModals(ModalType.NLU_MODEL_QUICK_VIEW);
  const isMarkupTextActive = markup.creatingType === BlockType.MARKUP_TEXT;
  const isMarkupMediaActive = Realtime.Utils.typeGuards.isMarkupMediaBlockType(markup.creatingType);

  return (
    <>
      <Box.Flex gap={8} mr={24}>
        <Dropdown menu={(onToggle) => <MoveTypePopover closePopover={onToggle} />}>
          {(ref, onToggle, isOpen) => (
            <HeaderIconButton
              ref={ref}
              icon="cursorV2"
              active={!isMarkupTextActive && !isMarkupMediaActive && !isCommentingMode}
              isSmall
              onClick={stopPropagation(onDisableModes)}
              tooltip={{ title: 'Move', hotkey: HOTKEY_LABEL_MAP[Hotkey.MOVE_MODE] }}
              expandable
              expandActive={isOpen}
              expandTooltip={{ title: 'Move type', distance: 32 }}
              onExpandClick={stopPropagation(onToggle)}
            />
          )}
        </Dropdown>

        {canUseHintFeatures && canEditCanvas && (
          <HeaderIconButton
            icon="markupImageV2"
            active={isMarkupTextActive}
            isSmall
            tooltip={{ title: 'Text Markup', hotkey: HOTKEY_LABEL_MAP[Hotkey.ADD_MARKUP_TEXT] }}
            onClick={stopPropagation(markup.toggleTextCreating)}
            className={`${ClassName.CANVAS_CONTROL}--markup-text`}
          />
        )}

        {canUseHintFeatures &&
          canEditCanvas &&
          (stickersDropdown.isEnabled ? (
            <Dropdown menu={() => <StickersDropdown />}>
              {(ref, onToggle, isOpen) => (
                <HeaderIconButton
                  ref={ref}
                  icon="addImage"
                  active={isMarkupMediaActive}
                  isSmall
                  onClick={markup.triggerMediaUpload}
                  tooltip={{ title: 'Image or Video', hotkey: HOTKEY_LABEL_MAP[Hotkey.ADD_MARKUP_IMAGE] }}
                  className={`${ClassName.CANVAS_CONTROL}--markup-image`}
                  expandable
                  expandActive={isOpen}
                  expandTooltip={{ title: 'Stickers', distance: 32 }}
                  onExpandClick={stopPropagation(onToggle)}
                />
              )}
            </Dropdown>
          ) : (
            <HeaderIconButton
              icon="addImage"
              active={isMarkupMediaActive}
              isSmall
              onClick={markup.triggerMediaUpload}
              tooltip={{ title: 'Image or Video', hotkey: HOTKEY_LABEL_MAP[Hotkey.ADD_MARKUP_IMAGE] }}
              className={`${ClassName.CANVAS_CONTROL}--markup-image`}
            />
          ))}

        {canUseHintFeatures && (
          <HeaderIconButton
            icon="commentV2"
            active={isCommentingMode}
            isSmall
            tooltip={{ title: 'Comment', hotkey: HOTKEY_LABEL_MAP[Hotkey.OPEN_COMMENTING] }}
            onClick={stopPropagation(onToggleCommenting)}
            className={`${ClassName.CANVAS_CONTROL}--commenting`}
            withBadge={hasUnreadComments}
          />
        )}

        {canEditCanvas && (
          <HeaderIconButton
            icon="modelQuickview"
            active={nluQuickView.isOpened}
            isSmall
            onClick={trackingEventsWrapper(nluQuickView.open, 'trackCanvasControlInteractionModel')}
            tooltip={{ title: 'NLU Model', hotkey: HOTKEY_LABEL_MAP[Hotkey.OPEN_CMS_MODAL] }}
          />
        )}
      </Box.Flex>
    </>
  );
};

export default CanvasHeader;
