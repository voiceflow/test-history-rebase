import React from 'react';

import IntentForm, { HelpTooltip, LegacyMappings } from '@/components/IntentForm';
import IntentSelect from '@/components/IntentSelect';
import Section from '@/components/Section';
import { NamespaceProvider } from '@/contexts';
import * as Intent from '@/ducks/intent';
import * as ProjectV2 from '@/ducks/projectV2';
import { connect } from '@/hocs';
import { NodeData } from '@/models';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { ConnectedProps, MergeArguments } from '@/types';
import { getDistinctPlatformValue, setDistinctPlatformValue } from '@/utils/platform';

import { NodeEditor, NodeEditorPropsType } from '../types';

const DEFAULT_INTENT = {
  id: '',
  inputs: [],
  name: '',
  platform: '',
  slots: {},
};

const LegacyMappingsComponent = LegacyMappings as React.FC<any>;

const IntentEditor: NodeEditor<NodeData.Intent, ConnectedIntentEditorProps> = ({ intent, data, platformData, patchPlatformData, pushToPath }) => (
  <Content footer={() => <Controls tutorial={{ content: <HelpTooltip />, blockType: data.type }} />}>
    <Section>
      <IntentSelect intent={intent} onChange={patchPlatformData} />
    </Section>
    <NamespaceProvider value={['intent', intent?.id]}>
      <IntentForm intent={intent} pushToPath={pushToPath} />
    </NamespaceProvider>
    <LegacyMappingsComponent intent={intent} mappings={platformData.mappings} onDelete={() => patchPlatformData({ mappings: [] })} />
  </Content>
);

const mapStateToProps = {
  intent: Intent.platformIntentByIDSelector,
  platform: ProjectV2.active.platformSelector,
};

const mergeProps = (
  ...[{ platform, intent: getIntentByID }, _, { data, onChange }]: MergeArguments<typeof mapStateToProps, {}, NodeEditorPropsType<NodeData.Intent>>
) => {
  const platformData = getDistinctPlatformValue(platform, data);

  return {
    platformData,
    patchPlatformData: (patch: Partial<NodeData.Intent.PlatformData>) => onChange(setDistinctPlatformValue(platform, { ...platformData, ...patch })),
    intent: platformData.intent ? getIntentByID(platformData.intent) : DEFAULT_INTENT,
  };
};

type ConnectedIntentEditorProps = ConnectedProps<typeof mapStateToProps, {}, typeof mergeProps>;

export default connect(mapStateToProps, null, mergeProps)(IntentEditor as React.FC) as NodeEditor<NodeData.Intent>;
