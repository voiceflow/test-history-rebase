import React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'styled-components';

import Drawer from '@/components/Drawer';
import { BlockType } from '@/constants';
import BlockEditor from '@/containers/CanvasV2/components/BlockEditor';
import { LockedBlockOverlay } from '@/containers/CanvasV2/components/LockedEditorOverlay';
import Reprompt from '@/containers/CanvasV2/components/Reprompt';
import { EditPermissionContext, withEngine } from '@/containers/CanvasV2/contexts';
import { getManager } from '@/containers/CanvasV2/managers';
import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';
import { RemoveIntercom } from '@/hocs/removeIntercom';
import { useEnableDisable } from '@/hooks/toggle';
import { stopImmediatePropagation } from '@/utils/dom';

import EditorContentContainer from './components/EditorContentContainer';
import EditorModal from './components/EditorModal';

const UNEDITABLE_BLOCKS = [BlockType.START, BlockType.COMBINED, BlockType.COMMENT];

function EditSidebar({ focus, data, theme, engine }) {
  const { canEdit: isVisible } = React.useContext(EditPermissionContext);
  const [isModal, enableModalMode, disableModalMode] = useEnableDisable(false);
  const shouldRender = data && !UNEDITABLE_BLOCKS.includes(data.type);
  const isOpen = isVisible && shouldRender && focus.isActive && !isModal;
  const updateData = React.useCallback((value, save = true) => focus.target && engine.node.updateData(focus.target, value, save), [focus.target]);

  const removeNode = () => engine.node.remove(data.nodeID);
  const duplicateNode = () => engine.node.duplicate(data.nodeID);

  let editor = null;

  if (shouldRender) {
    const { editor: Editor, reprompt } = getManager(data.type);

    editor = (
      <>
        <BlockEditor
          onExpand={enableModalMode}
          expanded={isModal}
          data={data}
          onChange={updateData}
          onRemove={removeNode}
          onDuplicate={duplicateNode}
          hideHeader={isModal}
          key={data.nodeID}
          renameActiveRevision={focus.renameActiveRevision}
        >
          <EditorContentContainer>
            <Editor data={data} onChange={updateData} />
            {reprompt && <Reprompt data={data} onChange={updateData} />}
          </EditorContentContainer>
        </BlockEditor>
      </>
    );
  }

  return (
    <>
      <Drawer
        as="section"
        direction="left"
        width={theme.components.editSidebar.width}
        open={isOpen}
        onPaste={stopImmediatePropagation()}
        disableAnimation={!shouldRender}
      >
        {!isModal && editor}
        {shouldRender && <LockedBlockOverlay nodeID={data.nodeID} disabled={!isOpen && !isModal} />}
      </Drawer>
      {isOpen && !isModal && <RemoveIntercom />}
      {isModal && <EditorModal disableModalMode={disableModalMode} isModal={isModal} editor={editor} data={data} />}
    </>
  );
}

const mapStateToProps = {
  data: Creator.dataByNodeIDSelector,
  focus: Creator.creatorFocusSelector,
};

const mergeProps = ({ data, focus }) => ({
  data: focus.target && data(focus.target),
});

export default compose(
  withEngine,
  connect(
    mapStateToProps,
    null,
    mergeProps
  ),
  withTheme
)(EditSidebar);
