import React from 'react';

import Section from '@/components/Section';
import * as Diagram from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { Content } from '@/pages/Canvas/components/Editor';
import { FadeLeftContainer } from '@/styles/animations';

import { Mapping } from '../Component/components';
import { variableMappingFactory } from '../Component/components/Mapping/components/MappingSection';
import { Flow, Footer } from './components';

function FlowEditor({ data, onChange, diagram, loadFlowVariables, goToDiagram }) {
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
          <Mapping isFlow data={data} updateInputs={(inputs) => onChange({ inputs })} updateOutputs={(outputs) => onChange({ outputs })} />
        </FadeLeftContainer>
      ) : null}
    </Content>
  );
}

const mapStateToProps = {
  diagramByID: DiagramV2.getDiagramByIDSelector,
};

const mapDispatchToProps = {
  goToDiagram: Router.goToDiagramHistoryPush,
  loadFlowVariables: Diagram.loadLocalVariables,
};

const mergeProps = ({ diagramByID }, { goToDiagram }, { data }) => ({
  diagram: data.diagramID && diagramByID(data.diagramID),
  goToDiagram: () => goToDiagram(data.diagramID),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(FlowEditor);
