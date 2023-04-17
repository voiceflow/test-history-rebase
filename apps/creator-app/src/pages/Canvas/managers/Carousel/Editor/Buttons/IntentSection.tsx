import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SectionV2, StrengthGauge } from '@voiceflow/ui';
import React from 'react';

import IntentSelect from '@/components/IntentSelect';
import * as Intent from '@/ducks/intent';
import * as Tracking from '@/ducks/tracking';
import { useDispatch, useIntent } from '@/hooks';
import IntentRequiredEntitiesSection from '@/pages/Canvas/components/IntentRequiredEntitiesSection';
import { Entity } from '@/pages/Canvas/managers/components';
import { NodeEditorV2Props } from '@/pages/Canvas/managers/types';
import { getIntentStrengthLevel } from '@/utils/intent';

interface IntentsSectionProps<Data, BuiltInPorts extends Realtime.BuiltInPortRecord> {
  intentID?: string | null;
  buttonID: string;
  onChange: (intentId: string | null) => void;
  editor: NodeEditorV2Props<Data, BuiltInPorts>;
}

const IntentsSection = <Data, BuiltInPorts extends Realtime.BuiltInPortRecord>({
  editor,
  intentID,
  onChange,
}: IntentsSectionProps<Data, BuiltInPorts>): JSX.Element => {
  const [collapsed, setCollapsed] = React.useState(!intentID);
  const { intent, intentEditModal, intentIsBuiltIn, shouldDisplayRequiredEntities } = useIntent(intentID);

  const onAddRequiredEntity = useDispatch(Intent.addRequiredSlot);
  const onRemoveRequiredEntity = useDispatch(Intent.removeRequiredSlot);

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
        <SectionV2.Title bold={!collapsed}>
          Attach intent
          {intentID && (
            <Box.Flex pl={16}>
              <StrengthGauge
                width={36}
                level={intentIsBuiltIn ? StrengthGauge.Level.VERY_STRONG : getIntentStrengthLevel(intent?.inputs.length ?? 0)}
                tooltipLabelMap={{ [StrengthGauge.Level.NOT_SET]: 'No utterances' }}
              />
            </Box.Flex>
          )}
        </SectionV2.Title>
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
      </SectionV2.Content>

      {shouldDisplayRequiredEntities && intent && (
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
