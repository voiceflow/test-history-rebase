import * as Realtime from '@voiceflow/realtime-sdk';
import { ButtonVariant, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import IntentForm, { HelpTooltip as IntentTooltip, LegacyMappings } from '@/components/IntentForm';
import IntentSelect from '@/components/IntentSelect';
import Section, { SectionVariant } from '@/components/Section';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import { useDispatch, useSelector } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { getDistinctPlatformValue, setDistinctPlatformValue } from '@/utils/platform';

import { ComponentSelect, HelpTooltip as ComponentTooltip } from '../../Component/components';
import { NodeEditor } from '../../types';
import HelpMessage from './HelpMessage';
import HelpTooltip from './HelpTooltip';

const CommandEditorV2: NodeEditor<Realtime.NodeData.Command, {}> = ({ data, onChange, pushToPath }) => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const diagramByID = useSelector(DiagramV2.getDiagramByIDSelector);
  const getIntentByID = useSelector(IntentV2.getPlatformIntentByIDSelector);

  const goToDiagramHistoryPush = useDispatch(Router.goToDiagramHistoryPush);

  const platformData = getDistinctPlatformValue(platform, data);

  const intent = platformData.intent ? getIntentByID(platformData.intent) : null;
  const diagram = platformData.diagramID ? diagramByID(platformData.diagramID) : null;

  const goToDiagram = () => platformData.diagramID && goToDiagramHistoryPush(platformData.diagramID);
  const patchPlatformData = (patch: Partial<Realtime.NodeData.Command.PlatformData>) =>
    onChange(setDistinctPlatformValue(platform, { ...platformData, ...patch }));

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
        <IntentSelect
          intent={intent}
          onChange={({ intent }: { intent: string | null }) => patchPlatformData({ intent })}
          placeholder="Select intent to trigger component"
        />
      </Section>

      <IntentForm intent={intent} pushToPath={pushToPath} />

      <Section variant={SectionVariant.SUBSECTION} header="Component" tooltip={<ComponentTooltip />}>
        <ComponentSelect diagramID={platformData.diagramID} onChange={patchPlatformData} enterOnCreate={false} />
      </Section>

      <LegacyMappings intent={intent} mappings={platformData.mappings} onDelete={() => patchPlatformData({ mappings: [] })} />
    </Content>
  );
};

export default CommandEditorV2;
