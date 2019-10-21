import React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'styled-components';

import Drawer from '@/components/Drawer';
import { BlockType } from '@/constants';
import BlockEditor from '@/containers/CanvasV2/components/BlockEditor';
import Reprompt from '@/containers/CanvasV2/components/Reprompt';
import { getManager } from '@/containers/CanvasV2/managers';
import { dataByNodeIDSelector, focusSelector } from '@/ducks/creator';
import { connect } from '@/hocs';
import { RemoveIntercom } from '@/hocs/removeIntercom';
import { useEnableDisable } from '@/hooks/toggle';
import { stopImmediatePropagation } from '@/utils/dom';

import { TestingModeContext, withEngine } from '../../contexts';
import EditorContentContainer from './components/EditorContentContainer';
import EditorModal from './components/EditorModal';

const UNEDITABLE_BLOCKS = [BlockType.START, BlockType.COMBINED, BlockType.COMMENT];

function EditSidebar({ updateData, focus, data, theme, engine }) {
  const isVisible = !React.useContext(TestingModeContext);
  const [isModal, enableModalMode, disableModalMode] = useEnableDisable(false);
  const shouldRender = data && !UNEDITABLE_BLOCKS.includes(data.type);
  const isOpen = isVisible && shouldRender && focus.isActive && !isModal;

  const removeNode = () => engine.node.remove(data.nodeID);
  const duplicateNode = () => engine.node.duplicate(data.nodeID);

  let editor = null;

  if (shouldRender) {
    const { editor: Editor, reprompt } = getManager(data.type);

    editor = (
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
      </Drawer>
      {isOpen && !isModal && <RemoveIntercom />}
      {isModal && <EditorModal disableModalMode={disableModalMode} isModal={isModal} editor={editor} data={data} />}
    </>
  );
}

const mapStateToProps = {
  data: dataByNodeIDSelector,
  focus: focusSelector,
};

const mergeProps = ({ data, focus }, _, { engine }) => ({
  data: focus.target && data(focus.target),
  updateData: (value) => focus.target && engine.node.updateData(focus.target, value),
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
