import { Node } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import IntentForm, { HelpTooltip, LegacyMappings } from '@/components/IntentForm';
import { AvailabilityManager } from '@/components/IntentForm/components/Custom/components';
import IntentSelect from '@/components/IntentSelect';
import Section from '@/components/Section';
import { FeatureFlag } from '@/config/features';
import { NamespaceProvider } from '@/contexts';
import * as Creator from '@/ducks/creator';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import { connect } from '@/hocs';
import { useDispatch, useFeature, useSyncDispatch } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { EngineContext } from '@/pages/Canvas/contexts';
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

const IntentEditor: NodeEditor<Realtime.NodeData.Intent, ConnectedIntentEditorProps> = ({
  intent,
  data,
  platformData,
  patchPlatformData,
  pushToPath,
}) => {
  const engine = React.useContext(EngineContext)!;
  const topicsAndComponents = useFeature(FeatureFlag.TOPICS_AND_COMPONENTS);
  const validateTopicAvailability = useDispatch(Creator.validateTopicAvailability);
  const updateIntentSteps = useSyncDispatch(Realtime.diagram.updateIntentSteps);

  const isGlobalIntent = platformData.availability === Node.Intent.IntentAvailability.GLOBAL;

  const onChangeIntent = async ({ intent }: { intent: Nullable<string> }) => {
    await patchPlatformData({ intent });

    if (topicsAndComponents.isEnabled) {
      updateIntentSteps({ ...engine.context, stepID: data.nodeID, intentID: intent });
    }

    validateTopicAvailability();
  };

  const onChangeAvailability = async () => {
    const nextAvailability = isGlobalIntent ? Node.Intent.IntentAvailability.LOCAL : Node.Intent.IntentAvailability.GLOBAL;

    await patchPlatformData({ availability: nextAvailability });

    if (nextAvailability !== Node.Intent.IntentAvailability.GLOBAL) {
      validateTopicAvailability();
    }
  };

  return (
    <Content footer={() => <Controls tutorial={{ content: <HelpTooltip />, blockType: data.type }} />}>
      <Section>
        <IntentSelect intent={intent} onChange={onChangeIntent} />
      </Section>
      <NamespaceProvider value={['intent', intent?.id ?? '']}>
        <IntentForm intent={intent} pushToPath={pushToPath} />
      </NamespaceProvider>

      {topicsAndComponents.isEnabled ? <AvailabilityManager isEnabled={isGlobalIntent} onChange={onChangeAvailability} /> : null}

      <LegacyMappingsComponent intent={intent} mappings={platformData.mappings} onDelete={() => patchPlatformData({ mappings: [] })} />
    </Content>
  );
};

const mapStateToProps = {
  intent: IntentV2.getPlatformIntentByIDSelector,
  platform: ProjectV2.active.platformSelector,
};

const mergeProps = (
  ...[{ platform, intent: getIntentByID }, _, { data, onChange }]: MergeArguments<
    typeof mapStateToProps,
    {},
    NodeEditorPropsType<Realtime.NodeData.Intent>
  >
) => {
  const platformData = getDistinctPlatformValue(platform, data);

  return {
    intent: platformData.intent ? getIntentByID(platformData.intent) : DEFAULT_INTENT,
    platformData,
    patchPlatformData: (patch: Partial<Realtime.NodeData.Intent.PlatformData>) =>
      onChange(setDistinctPlatformValue(platform, { ...platformData, ...patch })),
  };
};

type ConnectedIntentEditorProps = ConnectedProps<typeof mapStateToProps, {}, typeof mergeProps>;

export default connect(mapStateToProps, null, mergeProps)(IntentEditor as React.FC) as NodeEditor<Realtime.NodeData.Intent>;
