import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import LegacyMappings from '@/components/IntentLegacyMappings';
import IntentSelect from '@/components/IntentSelect';
import * as Documentation from '@/config/documentation';
import * as IntentV2 from '@/ducks/intentV2';
import { useDispatch } from '@/hooks';
import { useIntent } from '@/hooks/intent.hook';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import IntentRequiredEntitiesSection from '@/pages/Canvas/components/IntentRequiredEntitiesSection';

import { Actions, Entity } from '../../components';
import AvailabilitySection from './AvailabilitySection';

const RootEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Intent, Realtime.NodeData.IntentBuiltInPorts>();

  const onAddRequiredEntity = useDispatch(IntentV2.addRequiredSlot);
  const onRemoveRequiredEntity = useDispatch(IntentV2.removeRequiredSlot);

  const { intent, onOpenIntentEditModal, intentIsBuiltIn, intentHasRequiredEntity } = useIntent(editor.data.intent);

  const patchPlatformData = (patch: Partial<Realtime.NodeData.Intent.PlatformData>) => editor.onChange({ ...editor.data, ...patch });

  const isGlobalIntent = editor.data.availability === BaseNode.Intent.IntentAvailability.GLOBAL;

  const onChangeIntent = ({ intent }: { intent: Nullable<string> }) => patchPlatformData({ intent });

  const onChangeAvailability = async () => {
    const nextAvailability = isGlobalIntent ? BaseNode.Intent.IntentAvailability.LOCAL : BaseNode.Intent.IntentAvailability.GLOBAL;

    await patchPlatformData({ availability: nextAvailability });
  };

  return (
    <EditorV2
      header={
        <EditorV2.ChipHeader color={editor.parentBlockData?.blockColor} onChangeColor={(blockColor) => editor.onChangeParentBlock({ blockColor })} />
      }
      footer={<EditorV2.DefaultFooter tutorial={Documentation.INTENT_STEP} />}
      dropLagAccept={Actions.Section.DRAG_TYPE}
    >
      <SectionV2.SimpleSection isAccent>
        <IntentSelect
          intent={intent}
          onChange={onChangeIntent}
          fullWidth
          clearable
          leftAction={
            intent
              ? {
                  icon: 'edit',
                  onClick: () => onOpenIntentEditModal({ intentID: intent.id }),
                  disabled: intent.id === VoiceflowConstants.IntentName.NONE,
                }
              : undefined
          }
          placeholder="Select trigger intent"
          inDropdownSearch
          alwaysShowCreate
          clearOnSelectActive
        />
      </SectionV2.SimpleSection>

      {/* TODO: [CMS V2] add required entities support */}
      {intent && !intentIsBuiltIn && intentHasRequiredEntity && 'slots' in intent && (
        <>
          <SectionV2.Divider inset />
          <IntentRequiredEntitiesSection
            onEntityClick={(entityID) => editor.goToNested({ path: Entity.PATH, params: { intentID: intent.id, entityID } })}
            onAddRequired={(entityID) => onAddRequiredEntity(intent.id, entityID)}
            intentEntities={intent.slots}
            onRemoveRequired={(entityID) => onRemoveRequiredEntity(intent.id, entityID)}
            onGeneratePrompt={(entityID) =>
              editor.goToNested({ path: Entity.PATH, params: { intentID: intent.id, entityID }, state: { autogenerate: true } })
            }
            addDropdownPlacement="bottom-end"
          />
        </>
      )}

      <SectionV2.Divider />
      <Actions.Section editor={editor} portID={editor.node.ports.out.builtIn[BaseModels.PortType.NEXT]} />

      <SectionV2.Divider />
      <AvailabilitySection isEnabled={isGlobalIntent} onChange={onChangeAvailability} />

      <LegacyMappings intent={intent} mappings={editor.data.mappings} onDelete={() => patchPlatformData({ mappings: [] })} />
    </EditorV2>
  );
};

export default RootEditor;
