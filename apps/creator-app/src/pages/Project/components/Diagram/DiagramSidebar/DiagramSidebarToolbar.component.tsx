import * as Realtime from '@voiceflow/realtime-sdk';
import { tid } from '@voiceflow/style';
import { MarkupToolbar } from '@voiceflow/ui-next';
import React from 'react';

import { BlockType } from '@/constants';
import { Permission } from '@/constants/permissions';
import { SearchContext } from '@/contexts/SearchContext';
import { usePermission } from '@/hooks/permission';
import { MarkupContext } from '@/pages/Project/contexts';
import { useCommentingMode, useCommentingToggle, useDisableModes } from '@/pages/Project/hooks';

import { toolbarStyle } from './DiagramSidebar.css';

interface IDiagramSidebarToolbar {
  sidebarVisible: boolean;
}

export const DiagramSidebarToolbar: React.FC<IDiagramSidebarToolbar> = ({ sidebarVisible }) => {
  const TEST_ID = 'diagram-sidebar-toolbar';

  const markup = React.useContext(MarkupContext);
  const search = React.useContext(SearchContext);

  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);
  const [canUseHintFeatures] = usePermission(Permission.CANVAS_HINT_FEATURES);

  const isMarkupTextActive = markup?.creatingType === BlockType.MARKUP_TEXT;
  const isMarkupMediaActive = Realtime.Utils.typeGuards.isMarkupMediaBlockType(markup?.creatingType);

  const onDisableModes = useDisableModes();
  const isCommentingMode = useCommentingMode();
  const onToggleCommenting = useCommentingToggle();

  return (
    <MarkupToolbar className={toolbarStyle({ sidebarVisible })}>
      <MarkupToolbar.Button
        testID={tid(TEST_ID, 'note')}
        onClick={isMarkupTextActive ? onDisableModes : markup?.toggleTextCreating}
        iconName="Note"
        isActive={isMarkupTextActive}
        disabled={!canEditCanvas || !canUseHintFeatures}
      />

      <MarkupToolbar.Button
        testID={tid(TEST_ID, 'comment')}
        onClick={isCommentingMode ? onDisableModes : onToggleCommenting}
        iconName="Comment"
        isActive={isCommentingMode}
        disabled={!canUseHintFeatures}
      />

      <MarkupToolbar.Button
        testID={tid(TEST_ID, 'media')}
        onClick={isMarkupMediaActive ? onDisableModes : markup?.triggerMediaUpload}
        iconName="Image"
        isActive={isMarkupMediaActive}
        disabled={!canEditCanvas || !canUseHintFeatures}
      />

      <MarkupToolbar.Button
        testID={tid(TEST_ID, 'search')}
        onClick={() => (search?.isVisible ? search.hide() : search?.toggle())}
        iconName="Search"
        isActive={search?.isVisible}
      />
    </MarkupToolbar>
  );
};
