import { BaseNode } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { LegacyMappings } from '@/components/IntentForm';
import IntentSelect from '@/components/IntentSelect';
import * as Documentation from '@/config/documentation';
import { FeatureFlag } from '@/config/features';
import * as Creator from '@/ducks/creator';
import * as Intent from '@/ducks/intent';
import * as ProjectV2 from '@/ducks/projectV2';
import { useDispatch, useFeature, useIntent, useSelector, useSyncDispatch } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import IntentRequiredEntitiesSection from '@/pages/Canvas/components/IntentRequiredEntitiesSection';

import { Entity } from '../../components';
import AvailabilitySection from './AvailabilitySection';

const RootEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Intent, Realtime.NodeData.IntentBuiltInPorts>();

  const topicsAndComponents = useFeature(FeatureFlag.TOPICS_AND_COMPONENTS);

  const isTopicsAndComponentsVersion = useSelector(ProjectV2.active.isTopicsAndComponentsVersionSelector);

  const onAddRequiredEntity = useDispatch(Intent.addRequiredSlot);
  const onRemoveRequiredEntity = useDispatch(Intent.removeRequiredSlot);
  const validateTopicAvailability = useDispatch(Creator.validateTopicAvailability);

  const { intent, intentEditModal, intentIsBuiltIn, intentHasRequiredEntity } = useIntent(editor.data.intent);

  const patchPlatformData = (patch: Partial<Realtime.NodeData.Intent.PlatformData>) => editor.onChange({ ...editor.data, ...patch });

  const updateIntentSteps = useSyncDispatch(Realtime.diagram.updateIntentSteps);

  const isGlobalIntent = editor.data.availability === BaseNode.Intent.IntentAvailability.GLOBAL;

  const onChangeIntent = async ({ intent }: { intent: Nullable<string> }) => {
    await patchPlatformData({ intent });

    if (topicsAndComponents.isEnabled && isTopicsAndComponentsVersion) {
      updateIntentSteps({ ...editor.engine.context, stepID: editor.nodeID, intent: intent ? { intentID: intent, global: isGlobalIntent } : null });
    }

    validateTopicAvailability();
  };

  const onChangeAvailability = async () => {
    const nextAvailability = isGlobalIntent ? BaseNode.Intent.IntentAvailability.LOCAL : BaseNode.Intent.IntentAvailability.GLOBAL;
    const nextAvailabilityIsGlobal = nextAvailability === BaseNode.Intent.IntentAvailability.GLOBAL;

    await patchPlatformData({ availability: nextAvailability });

    if (topicsAndComponents.isEnabled && isTopicsAndComponentsVersion) {
      updateIntentSteps({
        ...editor.engine.context,
        stepID: editor.nodeID,
        intent: intent?.id ? { intentID: intent.id, global: nextAvailabilityIsGlobal } : null,
      });
    }

    if (!nextAvailabilityIsGlobal) {
      validateTopicAvailability();
    }
  };

  return (
    <EditorV2 header={<EditorV2.DefaultHeader />} footer={<EditorV2.DefaultFooter tutorial={Documentation.INTENT_STEP} />}>
      <SectionV2.SimpleSection isAccent>
        <IntentSelect
          intent={intent}
          onChange={onChangeIntent}
          fullWidth
          clearable
          leftAction={intent ? { icon: 'edit', onClick: () => intentEditModal.open({ id: intent.id }) } : undefined}
          placeholder="Select trigger intent"
          inDropdownSearch
          alwaysShowCreate
          clearOnSelectActive
        />
      </SectionV2.SimpleSection>

      {intent && !intentIsBuiltIn && intentHasRequiredEntity && (
        <>
          <SectionV2.Divider inset />

          <IntentRequiredEntitiesSection
            onEntityClick={(entityID) => editor.goToNested({ path: Entity.PATH, params: { intentID: intent.id, entityID } })}
            onAddRequired={(entityID) => onAddRequiredEntity(intent.id, entityID)}
            intentEntities={intent.slots}
            onRemoveRequired={(entityID) => onRemoveRequiredEntity(intent.id, entityID)}
            addDropdownPlacement="bottom-end"
          />
        </>
      )}

      {topicsAndComponents.isEnabled && isTopicsAndComponentsVersion ? (
        <>
          <SectionV2.Divider />
          <AvailabilitySection isEnabled={isGlobalIntent} onChange={onChangeAvailability} />
        </>
      ) : null}

      <LegacyMappings intent={intent} mappings={editor.data.mappings} onDelete={() => patchPlatformData({ mappings: [] })} />
    </EditorV2>
  );
};

export default RootEditor;
