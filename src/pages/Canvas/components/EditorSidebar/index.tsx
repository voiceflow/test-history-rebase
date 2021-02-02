import React from 'react';
import { useSelector } from 'react-redux';
import { withTheme } from 'styled-components';

import Drawer from '@/components/Drawer';
import { RemoveIntercom } from '@/components/IntercomChat';
import { BlockType, MARKUP_NODES } from '@/constants';
import { NamespaceProvider } from '@/contexts';
import * as Creator from '@/ducks/creator';
import { useEnableDisable } from '@/hooks';
import { LockedBlockOverlay } from '@/pages/Canvas/components/LockedEditorOverlay';
import { ManagerContext, PlatformContext } from '@/pages/Canvas/contexts';
import BlockEditor from '@/pages/Canvas/editors/BlockEditor';
import MarkupEditor from '@/pages/Canvas/editors/MarkupEditor';
import { useEditingMode } from '@/pages/Skill/hooks';
import { Theme } from '@/styles/theme';
import { SlideOutDirection } from '@/styles/transitions/SlideOut.ts';
import { stopImmediatePropagation } from '@/utils/dom';
import { compose } from '@/utils/functional';

import EditorModal from './components/EditorModal';
import { SidebarProvider } from './contexts';
import { withManagerProps } from './hocs';
import { useEditorPath, useUpdateData } from './hooks';

const UNEDITABLE_BLOCKS = [BlockType.COMMENT, BlockType.MARKUP_IMAGE];

type EditSidebarProps = {
  theme: Theme;
};

const EditSidebar: React.FC<EditSidebarProps> = ({ theme }) => {
  const focus = useSelector(Creator.creatorFocusSelector);
  const focusedNodeData = useSelector(Creator.focusedNodeDataSelector);

  const isEditingMode = useEditingMode();
  const { node, path, goToPath, pushToPath, popFromPath } = useEditorPath();
  const getManager = React.useContext(ManagerContext)!;
  const platform = React.useContext(PlatformContext)!;
  const prevPathLength = React.useRef(0);
  const prevAnimationDistance = React.useRef(40);
  const [isModal, enableModalMode, disableModalMode] = useEnableDisable(false);
  const shouldRender = !!node && !UNEDITABLE_BLOCKS.includes(node.type);
  const isOpen = isEditingMode && shouldRender && focus.isActive && !!focusedNodeData && !isModal;
  const updateData = useUpdateData(node?.id);
  const onRename = React.useCallback((name) => updateData({ name }, true), [updateData]);

  const isMarkup = !!node && MARKUP_NODES.includes(node?.type);

  let editor = null;

  if (node !== null && shouldRender) {
    const { editorsByPath, editor: rootEditor, platforms = [] } = getManager(node.type);
    const activePath = path[path.length - 1] || {};

    const subManager = activePath.type && editorsByPath?.[activePath.type];
    let Manager: any = withManagerProps(subManager || rootEditor);

    if (platforms.length && !platforms.includes(platform)) {
      Manager = withManagerProps(getManager(BlockType.INVALID_PLATFORM).editor);
    }

    prevAnimationDistance.current =
      // eslint-disable-next-line no-nested-ternary
      prevPathLength.current < path.length ? 40 : prevPathLength.current > path.length ? -40 : prevAnimationDistance.current;

    const managerEl = (
      <Manager
        nodeID={node.id}
        onChange={updateData}
        onExpand={enableModalMode}
        expanded={isModal}
        goToPath={goToPath}
        activePath={activePath}
        pushToPath={pushToPath}
        popFromPath={popFromPath}
        isOpen={isOpen}
      />
    );

    if (isMarkup) {
      editor = (
        <NamespaceProvider value={['editor', node.type, node.id]}>
          <MarkupEditor key={node.id} animationDistance={prevAnimationDistance.current}>
            {managerEl}
          </MarkupEditor>
          <LockedBlockOverlay nodeID={node.id} disabled={!isOpen && !isModal} />
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
            hideTitle={node.type === BlockType.START}
            hideHeader={isModal}
            renameRevision={focus.renameActiveRevision}
            prevPathLength={prevPathLength.current}
            animationDistance={prevAnimationDistance.current}
          >
            {managerEl}
          </BlockEditor>
          <LockedBlockOverlay nodeID={node.id} disabled={!isOpen && !isModal} />
        </NamespaceProvider>
      );
    }

    if (prevPathLength.current !== path.length) {
      prevPathLength.current = path.length;
    }
  }

  return (
    <SidebarProvider>
      <Drawer
        as="section"
        key={focus.target ?? undefined} // required to fix layout issue - key cannot be `null` so change it to `undefined` if it is
        style={{ overflow: 'hidden' }}
        open={isOpen}
        width={isMarkup ? theme.components.markupSidebar.width : theme.components.blockSidebar.width}
        onPaste={stopImmediatePropagation()}
        direction={SlideOutDirection.LEFT}
        disableAnimation={!shouldRender}
      >
        {!isModal && !!path.length && editor}
      </Drawer>
      {isOpen && !isModal && <RemoveIntercom />}
      {isModal && <EditorModal disableModalMode={disableModalMode} editor={editor} />}
    </SidebarProvider>
  );
};

export default compose(withTheme, React.memo)(EditSidebar) as React.FC;
