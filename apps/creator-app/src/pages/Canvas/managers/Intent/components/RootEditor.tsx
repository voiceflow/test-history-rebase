import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import IntentSelect from '@/components/IntentSelect';
import * as Documentation from '@/config/documentation';
import { useIntent } from '@/hooks/intent.hook';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { Actions } from '../../components';
import AvailabilitySection from './AvailabilitySection';

const RootEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Intent, Realtime.NodeData.IntentBuiltInPorts>();

  const { intent, onOpenIntentEditModal } = useIntent(editor.data.intent);

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
      <SectionV2.Divider />
      <Actions.Section editor={editor} portID={editor.node.ports.out.builtIn[BaseModels.PortType.NEXT]} />

      <SectionV2.Divider />
      <AvailabilitySection isEnabled={isGlobalIntent} onChange={onChangeAvailability} />
    </EditorV2>
  );
};

export default RootEditor;
