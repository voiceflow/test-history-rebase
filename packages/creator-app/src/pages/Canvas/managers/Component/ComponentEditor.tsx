import * as Realtime from '@voiceflow/realtime-sdk';
import { BlockText, Link } from '@voiceflow/ui';
import React from 'react';

import Section from '@/components/Section';
import * as Documentation from '@/config/documentation';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Router from '@/ducks/router';
import { useDispatch, useSelector, useTheme } from '@/hooks';
import { Content } from '@/pages/Canvas/components/Editor';
import { NodeEditor } from '@/pages/Canvas/managers/types';
import { FadeLeftContainer } from '@/styles/animations';

import { ComponentSelect, Footer, Mapping } from './components';
import { variableMappingFactory } from './components/Mapping/components/MappingSection';

const ComponentEditor: NodeEditor<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts> = ({ data, onChange }) => {
  const theme = useTheme();
  const diagram = useSelector(DiagramV2.diagramByIDSelector, { id: data.diagramID });

  const goToDiagram = useDispatch(Router.goToDiagramHistoryPush);

  const addVariableMapping = React.useCallback(() => {
    const emptyVariableMap = variableMappingFactory();

    onChange({ inputs: [emptyVariableMap], outputs: [emptyVariableMap] });
  }, [onChange]);

  const clearVariableMapping = React.useCallback(() => {
    onChange({ inputs: [], outputs: [] });
  }, [onChange]);

  const onEdit = React.useCallback(() => {
    if (diagram) {
      goToDiagram(diagram.id);
    }
  }, [diagram]);

  const hasVariableMapping = !!data.inputs?.length || !!data.outputs?.length;

  return (
    <Content
      fillHeight={false}
      footer={() => (
        <Footer
          onEdit={onEdit}
          editable={!!diagram}
          blockType={data.type}
          addVariableMapping={addVariableMapping}
          hasVariableMapping={hasVariableMapping}
          clearVariableMapping={clearVariableMapping}
        />
      )}
    >
      <Section>
        <ComponentSelect onChange={onChange} diagramID={diagram?.id ?? null} />

        <BlockText mt={12} fontSize={theme.fontSizes.s} color={theme.colors.secondary}>
          Changes to this component will update globally. <Link href={Documentation.COMPONENT_STEP}>Learn more</Link>
        </BlockText>
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
