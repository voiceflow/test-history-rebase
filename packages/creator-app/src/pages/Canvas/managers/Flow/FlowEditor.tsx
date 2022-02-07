import * as Realtime from '@realtime-sdk';
import React from 'react';

import Section from '@/components/Section';
import * as Diagram from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Router from '@/ducks/router';
import { useDispatch, useSelector } from '@/hooks';
import { Content } from '@/pages/Canvas/components/Editor';
import { NodeEditor } from '@/pages/Canvas/managers/types';
import { FadeLeftContainer } from '@/styles/animations';

import { Mapping } from '../Component/components';
import { variableMappingFactory } from '../Component/components/Mapping/components/MappingSection';
import { Flow, Footer } from './components';

const FlowEditor: NodeEditor<Realtime.NodeData.Flow, Realtime.NodeData.FlowBuiltInPorts> = ({ data, onChange }) => {
  const diagram = useSelector(DiagramV2.diagramByIDSelector, { id: data.diagramID });
  const goToDiagramHistoryPush = useDispatch(Router.goToDiagramHistoryPush);
  const loadFlowVariables = useDispatch(Diagram.loadLocalVariables);

  const hasVariableMapping = !!data.inputs?.length || !!data.outputs?.length;

  React.useEffect(() => {
    if (diagram?.id) {
      loadFlowVariables(diagram.id);
    }
  }, [diagram?.id]);

  const emptyMapping = React.useCallback(() => {
    onChange({ inputs: [], outputs: [] });
  }, [onChange]);

  const startMapping = React.useCallback(() => {
    const emptyVariableMap = variableMappingFactory();
    onChange({ inputs: [emptyVariableMap], outputs: [emptyVariableMap] });
  }, [onChange]);

  const goToDiagram = React.useCallback(() => {
    if (data.diagramID) {
      goToDiagramHistoryPush(data.diagramID);
    }
  }, [goToDiagramHistoryPush, data.diagramID]);

  return (
    <Content
      fillHeight={false}
      footer={() => (
        <Footer
          diagram={diagram}
          hasVariableMapping={hasVariableMapping}
          emptyMapping={emptyMapping}
          startMapping={startMapping}
          goToDiagram={goToDiagram}
          blockType={data.type}
        />
      )}
    >
      <Section>
        <Flow onChange={onChange} diagram={diagram} diagramID={data.diagramID} />
      </Section>

      {hasVariableMapping && diagram ? (
        <FadeLeftContainer>
          <Mapping isFlow data={data} updateInputs={(inputs) => onChange({ inputs })} updateOutputs={(outputs) => onChange({ outputs })} />
        </FadeLeftContainer>
      ) : null}
    </Content>
  );
};

export default FlowEditor;
