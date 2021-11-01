import { Dropdown, Flex, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { HeaderDivider, HeaderIconButton } from '@/components/ProjectPage';
import { Permission } from '@/config/permissions';
import { BlockType, ModalType } from '@/constants';
import * as Thread from '@/ducks/thread';
import { useModals, usePermission, useSelector, useTrackingEvents } from '@/hooks';
import { Hotkey, HOTKEY_LABEL_MAP } from '@/keymap';
import { MarkupContext } from '@/pages/Project/contexts';
import { useCommentingMode, useCommentingToggle, useDisableModes } from '@/pages/Project/hooks';
import { ClassName } from '@/styles/constants';

import { MoveTypePopover } from './components';

const CanvasHeader: React.FC = () => {
  const markup = React.useContext(MarkupContext)!;

  const hasUnreadComments = useSelector(Thread.hasUnreadCommentsSelector);

  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const [canUseHintFeatures] = usePermission(Permission.HINT_FEATURES);

  const onDisableModes = useDisableModes();
  const isCommentingMode = useCommentingMode();
  const onToggleCommenting = useCommentingToggle();

  const [, trackingEventsWrapper] = useTrackingEvents();

  const imModal = useModals(ModalType.INTERACTION_MODEL);

  const isMarkupTextActive = markup.creatingType === BlockType.MARKUP_TEXT;
  const isMarkupImageActive = markup.creatingType === BlockType.MARKUP_IMAGE;

  return (
    <>
      <Flex gap={4}>
        <Dropdown menu={(onToggle) => <MoveTypePopover closePopover={onToggle} />}>
          {(ref, onToggle, isOpen) => (
            <HeaderIconButton
              ref={ref}
              icon="moveMode"
              active={!isMarkupTextActive && !isMarkupImageActive && !isCommentingMode}
              isSmall
              onClick={onDisableModes}
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
            icon="text"
            active={isMarkupTextActive}
            isSmall
            tooltip={{ title: 'Text', hotkey: HOTKEY_LABEL_MAP[Hotkey.ADD_MARKUP_TEXT] }}
            onClick={markup.toggleTextCreating}
            iconProps={{ width: 12, height: 14 }}
            className={`${ClassName.CANVAS_CONTROL}--markup-text`}
          />
        )}

        {canUseHintFeatures && canEditCanvas && (
          <HeaderIconButton
            icon="markupImage"
            active={isMarkupImageActive}
            isSmall
            onClick={markup.triggerImagesUpload}
            tooltip={{ title: 'Image', hotkey: HOTKEY_LABEL_MAP[Hotkey.ADD_MARKUP_IMAGE] }}
            className={`${ClassName.CANVAS_CONTROL}--markup-image`}
          />
        )}
      </Flex>

      {canUseHintFeatures && (
        <Flex>
          <HeaderDivider isSmall offset />

          <HeaderIconButton
            icon="comment"
            active={isCommentingMode}
            isSmall
            tooltip={{ title: 'Comment', hotkey: HOTKEY_LABEL_MAP[Hotkey.OPEN_COMMENTING] }}
            onClick={onToggleCommenting}
            className={`${ClassName.CANVAS_CONTROL}--commenting`}
            withBadge={hasUnreadComments}
          />

          {canEditCanvas && (
            <>
              <HeaderDivider isSmall offset />

              <HeaderIconButton
                icon="interactionModel"
                active={imModal.isOpened}
                isSmall
                onClick={trackingEventsWrapper(() => imModal.open(), 'trackCanvasControlInteractionModel')}
                tooltip={{ title: 'Model', hotkey: HOTKEY_LABEL_MAP[Hotkey.OPEN_CMS_MODAL] }}
              />
            </>
          )}
        </Flex>
      )}
    </>
  );
};

export default CanvasHeader;
