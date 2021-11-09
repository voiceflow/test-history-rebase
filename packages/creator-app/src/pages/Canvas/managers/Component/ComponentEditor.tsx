import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import Section from '@/components/Section';
import * as Diagram from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Router from '@/ducks/router';
import { useDispatch, useSelector } from '@/hooks';
import { Content } from '@/pages/Canvas/components/Editor';
import { NodeEditor } from '@/pages/Canvas/managers/types';
import { FadeLeftContainer } from '@/styles/animations';

import { Component, Footer, Mapping } from './components';
import { variableMappingFactory } from './components/Mapping/components/MappingSection';

const ComponentEditor: NodeEditor<Realtime.NodeData.Component> = ({ data, onChange }) => {
  const diagram = useSelector((state) => DiagramV2.diagramByIDSelector(state, { id: data.diagramID }));

  const goToDiagram = useDispatch(Router.goToDiagramHistoryPush);
  const loadComponentVariables = useDispatch(Diagram.loadLocalVariables);

  const addVariableMapping = React.useCallback(() => {
    const emptyVariableMap = variableMappingFactory();

    onChange({ inputs: [emptyVariableMap], outputs: [emptyVariableMap] });
  }, [onChange]);

  const clearVariableMapping = React.useCallback(() => {
    onChange({ inputs: [], outputs: [] });
  }, [onChange]);

  React.useEffect(() => {
    if (diagram?.id) {
      loadComponentVariables(diagram.id);
    }
  }, [diagram?.id]);

  const hasVariableMapping = !!data.inputs?.length || !!data.outputs?.length;

  return (
    <Content
      fillHeight={false}
      footer={() => (
        <Footer
          onEdit={() => diagram && goToDiagram(diagram.id)}
          editable={!!diagram}
          blockType={data.type}
          addVariableMapping={addVariableMapping}
          hasVariableMapping={hasVariableMapping}
          clearVariableMapping={clearVariableMapping}
        />
      )}
    >
      <Section>
        <Component onChange={onChange} diagramID={diagram?.id ?? null} />
      </Section>

      {hasVariableMapping && diagram ? (
        <FadeLeftContainer>
          <Mapping data={data} updateInputs={(inputs) => onChange({ inputs })} updateOutputs={(outputs) => onChange({ outputs })} />
        </FadeLeftContainer>
      ) : null}
    </Content>
  );
};

export default ComponentEditor;
