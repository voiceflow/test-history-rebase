import React from 'react';

import Section from '@/componentsV2/Section';
import { Content } from '@/containers/CanvasV2/components/Editor';
import * as Diagram from '@/ducks/diagram';
import * as Router from '@/ducks/router';
import { loadVariableSetForDiagram } from '@/ducks/variableSet';
import { connect } from '@/hocs';
import { FadeLeftContainer } from '@/styles/animations';

import { Flow, Footer, Mapping } from './components';
import { variableMappingFactory } from './components/Mapping/components/MappingSection';

function FlowEditor({ data, onChange, diagram, loadFlowVariables, goToDiagram }) {
  const hasVariableMapping = !!data.inputs?.length || !!data.outputs?.length;

  React.useEffect(() => {
    if (diagram?.id) {
      loadFlowVariables(diagram.id);
    }
  }, [diagram]);

  const emptyMapping = React.useCallback(() => {
    onChange({ inputs: [], outputs: [] });
  }, [onChange]);

  const startMapping = React.useCallback(() => {
    const emptyVariableMap = variableMappingFactory();
    onChange({ inputs: [emptyVariableMap], outputs: [emptyVariableMap] });
  }, [onChange]);

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
        <Flow data={data} onChange={onChange} diagram={diagram} diagramID={data.diagramID} />
      </Section>
      {hasVariableMapping && diagram ? (
        <FadeLeftContainer>
          <Mapping data={data} updateInputs={(inputs) => onChange({ inputs })} updateOutputs={(outputs) => onChange({ outputs })} />
        </FadeLeftContainer>
      ) : null}
    </Content>
  );
}

const mapStateToProps = {
  diagramByID: Diagram.diagramByIDSelector,
};

const mapDispatchToProps = {
  goToDiagram: Router.goToDiagram,
  loadFlowVariables: loadVariableSetForDiagram,
};

const mergeProps = ({ diagramByID }, { goToDiagram }, { data }) => ({
  diagram: data.diagramID && diagramByID(data.diagramID),
  goToDiagram: () => goToDiagram(data.diagramID),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(FlowEditor);
