import { ButtonVariant, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import IntentForm, { HelpTooltip as IntentTooltip, LegacyMappings } from '@/components/IntentForm';
import IntentSelect from '@/components/IntentSelect';
import Section, { SectionVariant } from '@/components/Section';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { NodeData } from '@/models';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { ConnectedProps, MergeArguments } from '@/types';
import { compose } from '@/utils/functional';
import { getDistinctPlatformValue, setDistinctPlatformValue } from '@/utils/platform';

import { Flow, HelpTooltip as FlowTooltip } from '../Flow/components';
import { NodeEditor, NodeEditorPropsType } from '../types';
import { HelpMessage, HelpTooltip } from './components';

const FlowComponent = Flow as React.FC<any>;
const LegacyMappingsComponent = LegacyMappings as React.FC<any>;

const CommandEditor: NodeEditor<NodeData.Command, ConnectedCommandEditorProps> = ({
  data,
  platformData,
  patchPlatformData,
  diagram,
  goToDiagram,
  intent,
  onChange,
  pushToPath,
  diagramByID,
}) => {
  const selectedFlowID = platformData.diagramID;

  useDidUpdateEffect(() => {
    if (selectedFlowID) {
      const selectedFlow = diagramByID(selectedFlowID);
      if (selectedFlow?.name) {
        onChange({ name: selectedFlow.name });
      }
    }
  }, [selectedFlowID]);

  return (
    <Content
      footer={
        <Controls
          options={[
            {
              label: 'Enter Flow',
              onClick: goToDiagram,
              variant: ButtonVariant.PRIMARY,
              disabled: !diagram,
            },
          ]}
          tutorial={{
            blockType: data.type,
            content: <HelpTooltip />,
            helpTitle: 'Having trouble?',
            helpMessage: <HelpMessage />,
          }}
          anchor="What are commands?"
        />
      }
    >
      <Section variant={SectionVariant.SUBSECTION} header="Flow" tooltip={<FlowTooltip />}>
        <FlowComponent data={{ ...data, ...platformData }} diagram={diagram} onChange={patchPlatformData} isCommand enterOnCreate={false} />
      </Section>

      <Section isDividerNested variant={SectionVariant.SUBSECTION} header="Intent" tooltip={<IntentTooltip />}>
        <IntentSelect intent={intent} onChange={({ intent }: { intent: string | null }) => patchPlatformData({ intent })} />
      </Section>
      <IntentForm intent={intent} pushToPath={pushToPath} />
      <LegacyMappingsComponent intent={intent} mappings={platformData.mappings} onDelete={() => patchPlatformData({ mappings: [] })} />
    </Content>
  );
};

const mapStateToProps = {
  platform: ProjectV2.active.platformSelector,
  diagrams: DiagramV2.allDiagramsSelector,
  diagramByID: DiagramV2.getDiagramByIDSelector,
  getIntentByID: IntentV2.getPlatformIntentByIDSelector,
};

const mapDispatchToProps = {
  goToDiagram: Router.goToDiagramHistoryPush,
};

const mergeProps = (
  ...[{ platform, getIntentByID, diagramByID }, { goToDiagram }, { data, onChange }]: MergeArguments<
    typeof mapStateToProps,
    typeof mapDispatchToProps,
    NodeEditorPropsType<NodeData.Command>
  >
) => {
  const platformData = getDistinctPlatformValue(platform, data);

  return {
    platformData,
    patchPlatformData: (patch: Partial<NodeData.Command.PlatformData>) => onChange(setDistinctPlatformValue(platform, { ...platformData, ...patch })),
    intent: platformData.intent && getIntentByID(platformData.intent),
    diagram: platformData.diagramID && diagramByID(platformData.diagramID),
    goToDiagram: () => goToDiagram(platformData.diagramID!),
    diagramByID,
  };
};

type ConnectedCommandEditorProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default compose(connect(mapStateToProps, mapDispatchToProps, mergeProps))(CommandEditor) as NodeEditor<NodeData.Command>;
