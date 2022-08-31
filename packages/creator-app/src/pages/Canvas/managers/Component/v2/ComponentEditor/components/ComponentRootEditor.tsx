import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import ComponentSelect from '@/components/ComponentSelect';
import * as Documentation from '@/config/documentation';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

const ComponentRootEditor: React.FC = () => {
  const { data, onChange } = EditorV2.useEditor<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts>();

  const goToDiagram = useDispatch(Router.goToDiagramHistoryPush);

  const { diagramID } = data;

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        <EditorV2.DefaultFooter tutorial={Documentation.COMPONENT_STEP}>
          {diagramID && (
            <Button variant={Button.Variant.PRIMARY} onClick={() => goToDiagram(diagramID)} squareRadius>
              Enter Component
            </Button>
          )}
        </EditorV2.DefaultFooter>
      }
    >
      <SectionV2.SimpleSection isAccent>
        <ComponentSelect componentID={diagramID} onChange={(diagramID) => onChange({ diagramID, inputs: [], outputs: [] })} />
      </SectionV2.SimpleSection>
    </EditorV2>
  );
};

export default ComponentRootEditor;
