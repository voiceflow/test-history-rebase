import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { LegacyMappings } from '@/components/IntentForm';
import IntentSelect from '@/components/IntentSelect';
import * as Documentation from '@/config/documentation';
import * as Intent from '@/ducks/intent';
import * as Tracking from '@/ducks/tracking';
import { useDispatch, useIntent } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import IntentRequiredEntitiesSection from '@/pages/Canvas/components/IntentRequiredEntitiesSection';

import { Actions, Entity } from '../../components';
import AvailabilitySection from './AvailabilitySection';

const RootEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Intent, Realtime.NodeData.IntentBuiltInPorts>();

  const onAddRequiredEntity = useDispatch(Intent.addRequiredSlot);
  const onRemoveRequiredEntity = useDispatch(Intent.removeRequiredSlot);

  const { intent, intentEditModal, intentIsBuiltIn, intentHasRequiredEntity } = useIntent(editor.data.intent);

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
              ? { icon: 'edit', onClick: () => intentEditModal.open({ id: intent.id, utteranceCreationType: Tracking.CanvasCreationType.QUICKVIEW }) }
              : undefined
          }
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
