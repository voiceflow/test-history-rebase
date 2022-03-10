import { stopImmediatePropagation } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import Drawer from '@/components/Drawer';
import { RemoveIntercom } from '@/components/IntercomChat';
import { BlockType, ModalType } from '@/constants';
import { NamespaceProvider } from '@/contexts';
import * as Creator from '@/ducks/creator';
import { useModals, useTheme } from '@/hooks';
import { LockedBlockOverlay } from '@/pages/Canvas/components/LockedEditorOverlay';
import { EngineContext, ManagerContext } from '@/pages/Canvas/contexts';
import BlockEditor from '@/pages/Canvas/editors/BlockEditor';
import MarkupEditor from '@/pages/Canvas/editors/MarkupEditor';
import { NodeEditor } from '@/pages/Canvas/managers/types';
import { PlatformContext, TypeV2Context } from '@/pages/Project/contexts';
import { useEditingMode } from '@/pages/Project/hooks';
import { SlideOutDirection } from '@/styles/transitions/SlideOut';
import { isMarkupBlockType } from '@/utils/typeGuards';

import EditorModal from './components/EditorModal';
import { SidebarHeaderAction, SidebarProvider } from './contexts';
import { useEditorPath, useUpdateData } from './hooks';

const UNEDITABLE_BLOCKS = [BlockType.MARKUP_IMAGE];
const EMPTY_HEADER_ACTIONS: SidebarHeaderAction[] = [];

const EditSidebar = () => {
  const theme = useTheme();

  const data = useSelector(Creator.focusedNodeDataSelector);
  const focus = useSelector(Creator.creatorFocusSelector);

  const engine = React.useContext(EngineContext)!;
  const platform = React.useContext(PlatformContext)!;
  const projectType = React.useContext(TypeV2Context)!;
  const getManager = React.useContext(ManagerContext)!;

  const prevPathLength = React.useRef(0);
  const prevAnimationDistance = React.useRef(40);

  const fullscreenEditorModal = useModals(ModalType.FULLSCREEN_EDITOR);

  const isEditingMode = useEditingMode();
  const { node, path, goToPath, pushToPath, popFromPath } = useEditorPath();

  const updateData = useUpdateData(node?.id);
  const onRename = React.useCallback((name) => updateData({ name }, true), [updateData]);

  const isMarkup = !!node && isMarkupBlockType(node.type);
  const shouldRender = !!data && !!node && !UNEDITABLE_BLOCKS.includes(node.type);
  const isOpen = isEditingMode && shouldRender && focus.isActive && !fullscreenEditorModal.isOpened;

  let editor = null;

  if (shouldRender) {
    const { editorsByPath, editor: rootEditor, platforms = [] } = getManager(node.type);
    const activePath = path[path.length - 1] || { label: '' };

    const subManager = activePath.type ? editorsByPath?.[activePath.type] ?? null : null;
    let Manager: NodeEditor<any> = subManager || rootEditor;

    if (platforms.length && !platforms.includes(platform)) {
      Manager = getManager(BlockType.INVALID_PLATFORM).editor;
    }

    prevAnimationDistance.current =
      // eslint-disable-next-line no-nested-ternary
      prevPathLength.current < path.length ? 40 : prevPathLength.current > path.length ? -40 : prevAnimationDistance.current;

    const managerEl = (
      <Manager
        data={data}
        node={node}
        engine={engine}
        isOpen={isOpen}
        nodeID={node.id}
        platform={platform}
        projectType={projectType}
        onChange={updateData}
        onExpand={fullscreenEditorModal.open}
        expanded={fullscreenEditorModal.isOpened}
        goToPath={goToPath}
        activePath={activePath}
        pushToPath={pushToPath}
        popFromPath={popFromPath}
      />
    );

    if (isMarkup) {
      editor = (
        <NamespaceProvider value={['editor', node.type, node.id]}>
          <MarkupEditor key={node.id} animationDistance={prevAnimationDistance.current}>
            {managerEl}
          </MarkupEditor>
          <LockedBlockOverlay nodeID={node.id} disabled={!isOpen && !fullscreenEditorModal.isOpened} />
        </NamespaceProvider>
      );
    } else {
      editor = (
        <NamespaceProvider value={['editor', node.type, node.id]}>
          <BlockEditor
            key={`${node.id}-${path.length}`}
            path={path}
            goToPath={goToPath}
            onRename={onRename}
            hideHeader={fullscreenEditorModal.isOpened}
            animationDistance={prevAnimationDistance.current}
          >
            {managerEl}
          </BlockEditor>
          <LockedBlockOverlay nodeID={node.id} disabled={!isOpen && !fullscreenEditorModal.isOpened} />
        </NamespaceProvider>
      );
    }

    if (prevPathLength.current !== path.length) {
      prevPathLength.current = path.length;
    }
  }

  return (
    <SidebarProvider headerActions={node?.type === BlockType.START ? EMPTY_HEADER_ACTIONS : undefined}>
      <Drawer
        as="section"
        key={focus.target ?? undefined} // required to fix layout issue - key cannot be `null` so change it to `undefined` if it is
        open={isOpen}
        style={{ overflow: 'hidden' }}
        width={isMarkup ? theme.components.markupSidebar.width : theme.components.blockSidebar.width}
        onPaste={stopImmediatePropagation()}
        direction={SlideOutDirection.LEFT}
        disableAnimation={!shouldRender}
      >
        {!fullscreenEditorModal.isOpened && !!path.length && editor}
      </Drawer>

      {isOpen && !fullscreenEditorModal.isOpened && <RemoveIntercom />}

      {fullscreenEditorModal.isOpened && <EditorModal editor={editor} />}
    </SidebarProvider>
  );
};

export default React.memo(EditSidebar);
