import { Node } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import React from 'react';

import IntentForm, { HelpTooltip, LegacyMappings } from '@/components/IntentForm';
import { AvailabilityManager } from '@/components/IntentForm/components/Custom/components';
import IntentSelect from '@/components/IntentSelect';
import Section from '@/components/Section';
import { FeatureFlag } from '@/config/features';
import { NamespaceProvider } from '@/contexts';
import * as Creator from '@/ducks/creator';
import * as Intent from '@/ducks/intent';
import * as ProjectV2 from '@/ducks/projectV2';
import { connect } from '@/hocs';
import { useDispatch, useFeature } from '@/hooks';
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
  availability: Node.Intent.IntentAvailability.GLOBAL,
};

const LegacyMappingsComponent = LegacyMappings as React.FC<any>;

const IntentEditor: NodeEditor<NodeData.Intent, ConnectedIntentEditorProps> = ({ intent, data, platformData, patchPlatformData, pushToPath }) => {
  const topicsAndComponents = useFeature(FeatureFlag.TOPICS_AND_COMPONENTS);
  const validateTopicAvailability = useDispatch(Creator.validateTopicAvailability);

  const isGlobalIntent = platformData.availability === Node.Intent.IntentAvailability.GLOBAL;

  const onChangeIntent = async ({ intent }: { intent: Nullable<string> }) => {
    await patchPlatformData({ intent });

    validateTopicAvailability();
  };

  const onChangeAvailability = async () => {
    const nextAvailability = isGlobalIntent ? Node.Intent.IntentAvailability.LOCAL : Node.Intent.IntentAvailability.GLOBAL;

    await patchPlatformData({ availability: nextAvailability });

    validateTopicAvailability();
  };

  return (
    <Content footer={() => <Controls tutorial={{ content: <HelpTooltip />, blockType: data.type }} />}>
      <Section>
        <IntentSelect intent={intent} onChange={onChangeIntent} />
      </Section>

      <NamespaceProvider value={['intent', intent?.id]}>
        <IntentForm intent={intent} pushToPath={pushToPath} />
      </NamespaceProvider>

      {topicsAndComponents.isEnabled ? <AvailabilityManager isEnabled={isGlobalIntent} onChange={onChangeAvailability} /> : null}

      <LegacyMappingsComponent intent={intent} mappings={platformData.mappings} onDelete={() => patchPlatformData({ mappings: [] })} />
    </Content>
  );
};

const mapStateToProps = {
  intent: Intent.platformIntentByIDSelector,
  platform: ProjectV2.active.platformSelector,
};

const mergeProps = (
  ...[{ platform, intent: getIntentByID }, _, { data, onChange }]: MergeArguments<typeof mapStateToProps, {}, NodeEditorPropsType<NodeData.Intent>>
) => {
  const platformData = getDistinctPlatformValue(platform, data);

  return {
    intent: platformData.intent ? getIntentByID(platformData.intent) : DEFAULT_INTENT,
    platformData,
    patchPlatformData: (patch: Partial<NodeData.Intent.PlatformData>) => onChange(setDistinctPlatformValue(platform, { ...platformData, ...patch })),
  };
};

type ConnectedIntentEditorProps = ConnectedProps<typeof mapStateToProps, {}, typeof mergeProps>;

export default connect(mapStateToProps, null, mergeProps)(IntentEditor as React.FC) as NodeEditor<NodeData.Intent>;
