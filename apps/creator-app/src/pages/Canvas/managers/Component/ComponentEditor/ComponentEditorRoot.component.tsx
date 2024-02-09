import * as Realtime from '@voiceflow/realtime-sdk';
import { stopImmediatePropagation } from '@voiceflow/ui';
import { Box, Button, Divider, Editor, Scroll } from '@voiceflow/ui-next';
import React from 'react';

import EditorV3 from '@/pages/Canvas/components/EditorV3';
import { FlowMapContext } from '@/pages/Canvas/contexts';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import { useMemoizedPropertyFilter } from '../../hooks/memoized-property-filter.hook';
import { editorStyles } from './Component.css';
import { Description } from './components/Description.component';
import { EmptyComponent } from './components/EmptyComponent.component';
import { SelectComponent } from './components/SelectComponent.component';

export const ComponentEditorRoot: NodeEditorV2<Realtime.NodeData.Component> = () => {
  const editor = EditorV3.useEditor<Realtime.NodeData.Component>();
  const componentMap = React.useContext(FlowMapContext)!;
  const diagramID = editor.data.diagramID || undefined;
  const [componentData] = useMemoizedPropertyFilter(Object.values(componentMap), { diagramID });

  const hasComponents = Object.values(componentMap).length > 0;

  const handleComponentChange = (patchData: Partial<Realtime.NodeData.Component>) => {
    editor.onChange({ ...editor.data, ...patchData });
  };

  return (
    <Editor title="Component" className={editorStyles} readOnly={true} headerActions={<EditorV3.HeaderActions />}>
      <Scroll>
        <Box direction="column" width="100%" maxHeight="calc(100vh - 60px - 56px * 2)" onPaste={stopImmediatePropagation()}>
          {hasComponents ? (
            <>
              <SelectComponent onChange={handleComponentChange} diagramID={diagramID} nodeID={editor.data.nodeID} />

              <Box pt={20}>
                <Divider noPadding />
              </Box>

              <Description description={componentData?.description} />
            </>
          ) : (
            <EmptyComponent />
          )}
        </Box>
      </Scroll>
    </Editor>
  );
};
