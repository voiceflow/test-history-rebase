import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SectionV2, StrengthGauge } from '@voiceflow/ui';
import React from 'react';

import IntentSelect from '@/components/IntentSelect';
import * as IntentV2 from '@/ducks/intentV2';
import { useDispatch } from '@/hooks';
import { useIntent } from '@/hooks/intent.hook';
import IntentRequiredEntitiesSection from '@/pages/Canvas/components/IntentRequiredEntitiesSection';
import { Entity } from '@/pages/Canvas/managers/components';
import { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

interface IntentsSectionProps<Data, BuiltInPorts extends Realtime.BuiltInPortRecord> {
  editor: NodeEditorV2Props<Data, BuiltInPorts>;
  intentID?: string | null;
  onChange: (intentId: string | null) => void;
}

const IntentsSection = <Data, BuiltInPorts extends Realtime.BuiltInPortRecord>({
  editor,
  intentID,
  onChange,
}: IntentsSectionProps<Data, BuiltInPorts>): JSX.Element => {
  const [collapsed, setCollapsed] = React.useState(!intentID);
  const { intent, onOpenIntentEditModal, strengthLevel, shouldDisplayRequiredEntities } = useIntent(intentID);

  const onAddRequiredEntity = useDispatch(IntentV2.addRequiredSlot);
  const onRemoveRequiredEntity = useDispatch(IntentV2.removeRequiredSlot);

  const CollapseButton = collapsed ? SectionV2.AddButton : SectionV2.RemoveButton;

  const onChangeCollapse = () => {
    if (!collapsed && intentID) {
      onChange(null);
    }

    setCollapsed(!collapsed);
  };

  return (
    <SectionV2.ActionCollapseSection
      title={
        <Box.Flex gap={16}>
          <SectionV2.Title bold={!collapsed}>Attach intent</SectionV2.Title>

          {intentID && (
            <Box.Flex pt={2}>
              <StrengthGauge width={36} level={strengthLevel} tooltipLabelMap={{ [StrengthGauge.Level.NOT_SET]: 'No utterances' }} />
            </Box.Flex>
          )}
        </Box.Flex>
      }
      action={<CollapseButton onClick={onChangeCollapse} />}
      collapsed={collapsed}
      contentProps={{
        px: 0,
      }}
    >
      <SectionV2.Content bottomOffset={2.5}>
        <IntentSelect
          intent={intent}
          onChange={({ intent }) => onChange(intent)}
          fullWidth
          clearable
          leftAction={intent ? { icon: 'edit', onClick: () => onOpenIntentEditModal({ intentID: intent.id }) } : undefined}
          placeholder="Select trigger intent"
          inDropdownSearch
          alwaysShowCreate
          clearOnSelectActive
        />
      </SectionV2.Content>

      {/* TODO: [CMS V2] add required entities */}
      {shouldDisplayRequiredEntities && intent && 'slots' in intent && (
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
    </SectionV2.ActionCollapseSection>
  );
};

export default IntentsSection;
