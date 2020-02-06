import React from 'react';
import { withTheme } from 'styled-components';

import Drawer from '@/components/Drawer';
import { BlockType } from '@/constants';
import { LockedBlockOverlay } from '@/containers/CanvasV2/components/LockedEditorOverlay';
import { EditPermissionContext, ManagerContext } from '@/containers/CanvasV2/contexts';
import { NamespaceProvider } from '@/contexts';
import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';
import { RemoveIntercom } from '@/hocs/removeIntercom';
import { useEnableDisable } from '@/hooks';
import { stopImmediatePropagation } from '@/utils/dom';
import { compose } from '@/utils/functional';

import Editor from '../Editor';
import EditorModal from './components/EditorModal';
import { SidebarProvider } from './contexts';
import { withManagerProps } from './hocs';
import { useEditorPath, useUpdateData } from './hooks';

const UNEDITABLE_BLOCKS = [BlockType.START, BlockType.COMMENT];

function EditSidebar({ focus, node, parent, theme }) {
  const { canEdit: isVisible } = React.useContext(EditPermissionContext);
  const { path, goToPath, pushToPath, popFromPath } = useEditorPath(node, parent);
  const getManager = React.useContext(ManagerContext);
  const prevPathLength = React.useRef(0);
  const prevAnimationDistance = React.useRef(40);
  const [isModal, enableModalMode, disableModalMode] = useEnableDisable(false);
  const shouldRender = node && !UNEDITABLE_BLOCKS.includes(node.type);
  const isOpen = isVisible && shouldRender && focus.isActive && !isModal;
  const updateData = useUpdateData(node?.id);
  const onRename = React.useCallback((name) => updateData({ name }, true), [updateData]);

  let editor = null;

  if (shouldRender) {
    const { editorsByPath, editor: rootEditor } = getManager(node.type);
    const activePath = path[path.length - 1] || {};

    const Manager = withManagerProps(editorsByPath?.[activePath.type] || rootEditor);
    prevAnimationDistance.current =
      // eslint-disable-next-line no-nested-ternary
      prevPathLength.current < path.length ? 40 : prevPathLength.current > path.length ? -40 : prevAnimationDistance.current;

    editor = (
      <NamespaceProvider value={['editor', node.type, node.id]}>
        <Editor
          key={`${node.id}-${path.length}`}
          path={path}
          goToPath={goToPath}
          onRename={onRename}
          hideHeader={isModal}
          renameRevision={focus.renameActiveRevision}
          prevPathLength={prevPathLength.current}
          animationDistance={prevAnimationDistance.current}
        >
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
        </Editor>
        <LockedBlockOverlay nodeID={node.id} disabled={!isOpen && !isModal} />
      </NamespaceProvider>
    );

    if (prevPathLength.current !== path.length) {
      prevPathLength.current = path.length;
    }
  }

  return (
    <SidebarProvider>
      <Drawer
        as="section"
        key={focus.target} // required to fix layout issue
        style={{ overflow: 'hidden' }}
        open={isOpen}
        width={theme.components.editSidebar.width}
        onPaste={stopImmediatePropagation()}
        direction="left"
        disableAnimation={!shouldRender}
      >
        {!isModal && !!path.length && editor}
      </Drawer>
      {isOpen && !isModal && <RemoveIntercom />}
      {isModal && <EditorModal disableModalMode={disableModalMode} editor={editor} />}
    </SidebarProvider>
  );
}

const mapStateToProps = {
  node: Creator.focusedNodeSelector,
  parent: Creator.dataByNodeIDSelector,
  focus: Creator.creatorFocusSelector,
};

const mergeProps = ({ node, parent: getParentData }) => {
  const parent = node?.parentNode && getParentData(node.parentNode);

  return { parent };
};

export default compose(
  connect(
    mapStateToProps,
    null,
    mergeProps
  ),
  withTheme,
  React.memo
)(EditSidebar);
