import * as Realtime from '@voiceflow/realtime-sdk';
import { ButtonVariant, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import IntentForm, { HelpTooltip as IntentTooltip, LegacyMappings } from '@/components/IntentForm';
import IntentSelect from '@/components/IntentSelect';
import Section, { SectionVariant } from '@/components/Section';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as IntentV2 from '@/ducks/intentV2';
import * as Router from '@/ducks/router';
import { useDispatch, useSelector } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor';

import { ComponentSelect, HelpTooltip as ComponentTooltip } from '../Component/components';
import { NodeEditor } from '../types';
import { HelpMessage, HelpTooltip } from './components';

const CommandEditorV2: NodeEditor<Realtime.NodeData.Command, {}> = ({ data, onChange, pushToPath }) => {
  const diagram = useSelector(DiagramV2.diagramByIDSelector, { id: data.diagramID });
  const intent = useSelector(IntentV2.platformIntentByIDSelector, { id: data.intent });

  const goToDiagramHistoryPush = useDispatch(Router.goToDiagramHistoryPush);

  const goToDiagram = () => data.diagramID && goToDiagramHistoryPush(data.diagramID);
  const patchPlatformData = (patch: Partial<Realtime.NodeData.Command.PlatformData>) => onChange({ ...data, ...patch });

  useDidUpdateEffect(() => {
    if (diagram?.name) {
      onChange({ name: diagram.name });
    }
  }, [diagram?.name]);

  return (
    <Content
      footer={
        <Controls
          options={[
            {
              label: 'Enter Component',
              onClick: goToDiagram,
              variant: ButtonVariant.PRIMARY,
              disabled: !diagram,
            },
          ]}
          tutorial={{
            blockType: data.type,
            content: <HelpTooltip isComponent />,
            helpTitle: 'Having trouble?',
            helpMessage: <HelpMessage />,
          }}
          anchor="What are commands?"
        />
      }
    >
      <Section isDividerNested variant={SectionVariant.SUBSECTION} header="Intent" tooltip={<IntentTooltip />}>
        <IntentSelect intent={intent} onChange={({ intent }) => patchPlatformData({ intent })} placeholder="Select intent to trigger component" />
      </Section>

      <IntentForm intent={intent} pushToPath={pushToPath} />

      <Section variant={SectionVariant.SUBSECTION} header="Component" tooltip={<ComponentTooltip />}>
        <ComponentSelect diagramID={data.diagramID} onChange={patchPlatformData} enterOnCreate={false} />
      </Section>

      <LegacyMappings intent={intent} mappings={data.mappings} onDelete={() => patchPlatformData({ mappings: [] })} />
    </Content>
  );
};

export default CommandEditorV2;
