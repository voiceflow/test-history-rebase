import * as Realtime from '@voiceflow/realtime-sdk';
import { stopImmediatePropagation } from '@voiceflow/ui';
import { Box, Divider, Editor, Scroll } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useSelector } from '@/hooks';
import EditorV3 from '@/pages/Canvas/components/EditorV3';

import { editorStyles } from './Component.css';
import { ComponentEditorDescription } from './components/ComponentEditorDescription.component';
import { ComponentEditorFlowSelect } from './components/ComponentEditorFlowSelect.component';
import { ComponentEditorFlowsEmpty } from './components/ComponentEditorFlowsEmpty.component';

interface ComponentEditorBaseProps {
  headerActions?: JSX.Element;
}

export const ComponentEditorBase: React.FC<ComponentEditorBaseProps> = ({ headerActions }) => {
  const editor = EditorV3.useEditor<Realtime.NodeData.Component>();
  const flows = useSelector(Designer.Flow.selectors.allOrderedByName);
  const flow = useSelector(Designer.Flow.selectors.byDiagramID, {
    diagramID: editor.data.diagramID,
  });
  const hasFlows = flows.length > 0;

  return (
    <Editor title="Component" className={editorStyles} readOnly={true} headerActions={headerActions}>
      <Scroll>
        <Box direction="column" width="100%" maxHeight="calc(100vh - 56px * 2)" onPaste={stopImmediatePropagation()}>
          {hasFlows ? (
            <>
              <ComponentEditorFlowSelect
                onSelect={(flow) => editor.onChange({ diagramID: flow.diagramID })}
                diagramID={editor.data.diagramID}
                activeNodeID={editor.data.nodeID}
              />

              <Box pt={20}>
                <Divider noPadding />
              </Box>

              <ComponentEditorDescription description={flow?.description} />
            </>
          ) : (
            <ComponentEditorFlowsEmpty onCreate={(flow) => editor.onChange({ diagramID: flow.diagramID })} />
          )}
        </Box>
      </Scroll>
    </Editor>
  );
};
