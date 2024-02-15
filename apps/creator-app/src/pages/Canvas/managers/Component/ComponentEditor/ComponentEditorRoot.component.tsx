import * as Realtime from '@voiceflow/realtime-sdk';
import { stopImmediatePropagation } from '@voiceflow/ui';
import { Box, Divider, Editor, Scroll } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useSelector } from '@/hooks';
import EditorV3 from '@/pages/Canvas/components/EditorV3';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import { editorStyles } from './Component.css';
import { ComponentEditorDescription } from './components/ComponentEditorDescription.component';
import { ComponentEditorFlowSelect } from './components/ComponentEditorFlowSelect.component';
import { ComponentEditorFlowsEmpty } from './components/ComponentEditorFlowsEmpty.component';

export const ComponentEditorRoot: NodeEditorV2<Realtime.NodeData.Component> = () => {
  const editor = EditorV3.useEditor<Realtime.NodeData.Component>();
  const flows = useSelector(Designer.Flow.selectors.all);
  const flow = useSelector(Designer.Flow.selectors.byDiagramID, {
    diagramID: editor.data.diagramID,
  });

  const hasFlows = flows.length > 0;

  return (
    <Editor title="Component" className={editorStyles} readOnly={true} headerActions={<EditorV3.HeaderActions />}>
      <Scroll>
        <Box direction="column" width="100%" maxHeight="calc(100vh - 56px * 2)" onPaste={stopImmediatePropagation()}>
          {hasFlows ? (
            <>
              <ComponentEditorFlowSelect
                flowID={editor.data.diagramID}
                activeNodeID={editor.data.nodeID}
                onSelect={(flow) => editor.onChange({ diagramID: flow.diagramID })}
              />

              <Box pt={20}>
                <Divider noPadding />
              </Box>

              <ComponentEditorDescription
                description={`${flow?.description}lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum.`}
              />
            </>
          ) : (
            <ComponentEditorFlowsEmpty />
          )}
        </Box>
      </Scroll>
    </Editor>
  );
};
