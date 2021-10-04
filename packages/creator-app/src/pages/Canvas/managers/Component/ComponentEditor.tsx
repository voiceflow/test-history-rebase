import React from 'react';

import Section from '@/components/Section';
import * as Diagram from '@/ducks/diagram';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { NodeData } from '@/models';
import { Content } from '@/pages/Canvas/components/Editor';
import { NodeEditor, NodeEditorPropsType } from '@/pages/Canvas/managers/types';
import { FadeLeftContainer } from '@/styles/animations';
import { ConnectedProps, MergeArguments } from '@/types';

import { Component, Footer, Mapping } from './components';
import { variableMappingFactory } from './components/Mapping/components/MappingSection';

const ComponentEditor: NodeEditor<NodeData.Component, ConnectedComponentEditorProps> = ({
  data,
  onChange,
  diagram,
  loadComponentVariables,
  goToDiagram,
}) => {
  const hasVariableMapping = !!data.inputs?.length || !!data.outputs?.length;

  React.useEffect(() => {
    if (diagram?.id) {
      loadComponentVariables(diagram.id);
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
        <Component onChange={onChange} diagram={diagram} diagramID={data.diagramID} />
      </Section>

      {hasVariableMapping && diagram ? (
        <FadeLeftContainer>
          <Mapping data={data} updateInputs={(inputs) => onChange({ inputs })} updateOutputs={(outputs) => onChange({ outputs })} />
        </FadeLeftContainer>
      ) : null}
    </Content>
  );
};

const mapStateToProps = {
  diagramByID: Diagram.diagramByIDSelector,
};

const mapDispatchToProps = {
  goToDiagram: Router.goToDiagramHistoryPush,
  loadComponentVariables: Diagram.loadLocalVariables,
};

const mergeProps = (
  ...[{ diagramByID }, { goToDiagram }, { data }]: MergeArguments<
    typeof mapStateToProps,
    typeof mapDispatchToProps,
    NodeEditorPropsType<NodeData.Component>
  >
) => {
  return {
    diagram: data.diagramID ? diagramByID(data.diagramID) : null,
    goToDiagram: () => goToDiagram(data.diagramID!),
  };
};

type ConnectedComponentEditorProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ComponentEditor) as NodeEditor<NodeData.Component>;
