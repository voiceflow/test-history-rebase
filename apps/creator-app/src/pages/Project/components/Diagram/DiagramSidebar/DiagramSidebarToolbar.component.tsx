import * as Realtime from '@voiceflow/realtime-sdk';
import { tid } from '@voiceflow/style';
import { MarkupToolbar, MoveOptions, notify } from '@voiceflow/ui-next';
import React from 'react';

import { ControlScheme } from '@/components/Canvas/constants';
import { BlockType } from '@/constants';
import { Permission } from '@/constants/permissions';
import { SearchContext } from '@/contexts/SearchContext';
import * as UI from '@/ducks/ui';
import { useDispatch, useSelector } from '@/hooks';
import { usePermission } from '@/hooks/permission';
import { MarkupContext } from '@/pages/Project/contexts';
import { useCommentingMode, useCommentingToggle, useDisableModes } from '@/pages/Project/hooks';

import { toolbarStyle } from './DiagramSidebar.css';

export const DiagramSidebarToolbar: React.FC = () => {
  const TEST_ID = 'diagram-sidebar-toolbar';

  const markup = React.useContext(MarkupContext);
  const search = React.useContext(SearchContext);

  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);
  const [canUseHintFeatures] = usePermission(Permission.CANVAS_HINT_FEATURES);

  const canvasNavigation = useSelector(UI.selectors.canvasNavigation);
  const setCanvasNavigation = useDispatch(UI.action.SetCanvasNavigation);

  const [movePopperOpened, setMovePopperOpened] = React.useState(false);

  const isMarkupTextActive = markup?.creatingType === BlockType.MARKUP_TEXT;
  const isMarkupMediaActive = Realtime.Utils.typeGuards.isMarkupMediaBlockType(markup?.creatingType);

  const onDisableModes = useDisableModes();
  const isCommentingMode = useCommentingMode();
  const onToggleCommenting = useCommentingToggle();

  const onMoveTypeChange = (moveType: MoveOptions) => {
    setCanvasNavigation(moveType.toUpperCase() as ControlScheme);

    notify.short.success('Updated');
  };

  return (
    <MarkupToolbar className={toolbarStyle}>
      <MarkupToolbar.MoveButton
        isOpen={movePopperOpened}
        moveOption={canvasNavigation.toLowerCase() as MoveOptions}
        onOpenChange={setMovePopperOpened}
        setMoveOption={onMoveTypeChange}
      />

      <MarkupToolbar.Button
        testID={tid(TEST_ID, 'note')}
        onClick={isMarkupTextActive ? onDisableModes : markup?.toggleTextCreating}
        iconName="Note"
        isActive={isMarkupTextActive}
        disabled={!canEditCanvas || !canUseHintFeatures}
        tooltipContent={{ text: 'Note', hotkeys: [{ label: 'N' }] }}
      />

      <MarkupToolbar.Button
        testID={tid(TEST_ID, 'comment')}
        onClick={isCommentingMode ? onDisableModes : onToggleCommenting}
        iconName="Comment"
        isActive={isCommentingMode}
        disabled={!canUseHintFeatures}
        tooltipContent={{ text: 'Comment', hotkeys: [{ label: 'C' }] }}
      />

      <MarkupToolbar.Button
        testID={tid(TEST_ID, 'media')}
        onClick={isMarkupMediaActive ? onDisableModes : markup?.triggerMediaUpload}
        iconName="Image"
        isActive={isMarkupMediaActive}
        disabled={!canEditCanvas || !canUseHintFeatures}
        tooltipContent={{ text: 'Image, GIF or video', hotkeys: [{ label: 'I' }] }}
      />

      <MarkupToolbar.Button
        testID={tid(TEST_ID, 'search')}
        onClick={() => (search?.isVisible ? search.hide() : search?.toggle())}
        iconName="Search"
        isActive={search?.isVisible}
        tooltipContent={{ text: 'Search', hotkeys: [{ iconName: 'Command' }, { label: 'K' }] }}
      />
    </MarkupToolbar>
  );
};
