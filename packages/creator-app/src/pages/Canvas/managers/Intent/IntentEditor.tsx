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
import { useDispatch, useFeature, useSelector, useSyncDispatch } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { getDistinctPlatformValue, setDistinctPlatformValue } from '@/utils/platform';

import { NodeEditor } from '../types';

const LegacyMappingsComponent = LegacyMappings as React.FC<any>;

const IntentEditor: NodeEditor<Realtime.NodeData.Intent, Realtime.NodeData.IntentBuiltInPorts> = ({
  data,
  engine,
  onChange,
  platform,
  pushToPath,
}) => {
  const getPlatformIntentByID = useSelector(IntentV2.getPlatformIntentByIDSelector);

  const topicsAndComponents = useFeature(FeatureFlag.TOPICS_AND_COMPONENTS);
  const validateTopicAvailability = useDispatch(Creator.validateTopicAvailability);

  const platformData = getDistinctPlatformValue(platform, data);
  const intent = platformData.intent ? getPlatformIntentByID(platformData.intent) : null;

  const patchPlatformData = React.useCallback(
    (patch: Partial<Realtime.NodeData.Intent.PlatformData>) => onChange(setDistinctPlatformValue(platform, { ...platformData, ...patch })),
    [onChange, platform, platformData]
  );

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
        <IntentSelect intent={intent} clearable onChange={onChangeIntent} />
      </Section>

      <NamespaceProvider value={['intent', intent?.id ?? '']}>
        <IntentForm intent={intent} pushToPath={pushToPath} />
      </NamespaceProvider>

      {topicsAndComponents.isEnabled ? <AvailabilityManager isEnabled={isGlobalIntent} onChange={onChangeAvailability} /> : null}

      <LegacyMappingsComponent intent={intent} mappings={platformData.mappings} onDelete={() => patchPlatformData({ mappings: [] })} />
    </Content>
  );
};

export default IntentEditor;
