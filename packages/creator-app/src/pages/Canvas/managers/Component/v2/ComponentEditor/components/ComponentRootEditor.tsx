import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import * as Diagram from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Router from '@/ducks/router';
import { useDispatch, useSelector } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { HelpTooltip } from '@/pages/Canvas/managers/Component/components';

import ComponentSelect from './ComponentSelect';

const ComponentRootEditor: React.FC = () => {
  const { data, onChange } = EditorV2.useEditor<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts>();
  const diagrams = useSelector(DiagramV2.active.componentDiagramsSelector);
  const createEmptyComponent = useDispatch(Diagram.createEmptyComponent);
  const goToDiagram = useDispatch(Router.goToDiagramHistoryPush);

  const onCreate = async (diagramName: string) => {
    const newDiagramID = await createEmptyComponent(diagramName);
    onChange({ diagramID: newDiagramID, inputs: [], outputs: [] });
  };

  const onSelectChange = (selectedDiagramID: string) => {
    if (selectedDiagramID === data.diagramID) {
      onChange({ diagramID: null });
      return;
    }

    onChange({ diagramID: selectedDiagramID, inputs: [], outputs: [] });
  };

  const onEnterFlow = () => data.diagramID && goToDiagram(data.diagramID);

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        <EditorV2.DefaultFooter tutorial={{ content: <HelpTooltip /> }}>
          {data.diagramID && (
            <Button variant={Button.Variant.PRIMARY} onClick={onEnterFlow} squareRadius>
              Enter Flow
            </Button>
          )}
        </EditorV2.DefaultFooter>
      }
    >
      <SectionV2.SimpleSection headerProps={{ py: 24 }}>
        <ComponentSelect diagrams={diagrams} selectedDiagramID={data.diagramID} onChange={onSelectChange} onCreate={onCreate} />
      </SectionV2.SimpleSection>
    </EditorV2>
  );
};

export default ComponentRootEditor;
