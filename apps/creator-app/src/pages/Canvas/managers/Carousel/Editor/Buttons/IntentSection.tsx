import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SectionV2, StrengthGauge } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import IntentSelect from '@/components/IntentSelect';
import { useIntent } from '@/hooks/intent.hook';
import { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

interface IntentsSectionProps<Data, BuiltInPorts extends Realtime.BuiltInPortRecord> {
  intentID?: string | null;
  buttonID: string;
  onChange: (intentId: string | null) => void;
  editor: NodeEditorV2Props<Data, BuiltInPorts>;
}

const IntentsSection = <Data, BuiltInPorts extends Realtime.BuiltInPortRecord>({
  intentID,
  onChange,
}: IntentsSectionProps<Data, BuiltInPorts>): JSX.Element => {
  const [collapsed, setCollapsed] = React.useState(!intentID);
  const { intent, strengthLevel, onOpenIntentEditModal } = useIntent(intentID);

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
              <StrengthGauge width={36} level={strengthLevel} tooltipLabelMap={{ [StrengthGauge.Level.NOT_SET]: 'No utterances' }} />
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
      </SectionV2.Content>
    </SectionV2.ActionCollapseSection>
  );
};

export default IntentsSection;
