import React from 'react';

import Section from '@/components/Section';
import * as Diagram from '@/ducks/diagram';
import * as Router from '@/ducks/router';
import { useDispatch, useSelector } from '@/hooks';
import { NodeData } from '@/models';
import { Content } from '@/pages/Canvas/components/Editor';
import { NodeEditor } from '@/pages/Canvas/managers/types';
import { FadeLeftContainer } from '@/styles/animations';

import { Component, Footer, Mapping } from './components';
import { variableMappingFactory } from './components/Mapping/components/MappingSection';

const ComponentEditor: NodeEditor<NodeData.Component> = ({ data, onChange }) => {
  const getDiagramByID = useSelector(Diagram.diagramByIDSelector);

  const diagram = data.diagramID ? getDiagramByID(data.diagramID) : null;

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
