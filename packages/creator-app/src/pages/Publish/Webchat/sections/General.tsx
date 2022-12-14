import { Nullish, Utils } from '@voiceflow/common';
import { PlanType } from '@voiceflow/internal';
import * as Platform from '@voiceflow/platform-config';
import { Box, Input, Label, Select, Text, ThemeColor, TippyTooltip, Toggle } from '@voiceflow/ui';
import { VoiceflowVersion } from '@voiceflow/voiceflow-types';
import React from 'react';

import { ENTERPRISE_PLANS, ModalType, TEAM_PLANS } from '@/constants';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useLinkedState, useModals, useSelector } from '@/hooks';
import { withTargetValue } from '@/utils/dom';

import Section from './components/Section';

const ENTITLED_PLANS = new Set<PlanType>([...ENTERPRISE_PLANS, ...TEAM_PLANS]);

const PERSISTENCE_LABEL_MAP: Record<string, string> = {
  [VoiceflowVersion.ChatPersistence.LOCAL_STORAGE]: 'Never forget',
  [VoiceflowVersion.ChatPersistence.MEMORY]: 'Forget after tab closed or reloaded',
};
const PERSISTENCE_OPTIONS = Object.keys(PERSISTENCE_LABEL_MAP) as VoiceflowVersion.ChatPersistence[];

const POSITION_OPTIONS = Object.values(VoiceflowVersion.ChatPosition);

const PX_LABEL = (
  <Text color={ThemeColor.SECONDARY} fontWeight={600}>
    PX
  </Text>
);

export const GeneralSection: React.FC = () => {
  const plan = useSelector(WorkspaceV2.active.planSelector);
  const config = useSelector(VersionV2.active.voiceflow.chat.publishingSelector);
  const updateConfig = useDispatch(Version.voiceflow.chat.patchActiveAndLivePublishing);

  const [title, setTitle] = useLinkedState(config.title);
  const [description, setDescription] = useLinkedState(config.description);
  const { open: openPaymentModal } = useModals(ModalType.PAYMENT);

  const updateProperty =
    <T extends keyof Platform.Voiceflow.Chat.Models.Version.Publishing.Model>(property: T) =>
    (value: Nullish<Platform.Voiceflow.Chat.Models.Version.Publishing.Model[T]>) => {
      if (Utils.array.isNotNullish(value)) updateConfig({ [property]: value }, { track: true });
    };

  const [sideSpacing, setSideSpacing] = useLinkedState(String(config.spacing?.side));
  const [bottomSpacing, setBottomSpacing] = useLinkedState(String(config.spacing?.bottom));

  const updateSpacing = () => updateConfig({ spacing: { side: Number(sideSpacing), bottom: Number(bottomSpacing) } }, { track: true });

  const toggleWatermark = () => updateConfig({ watermark: !config.watermark }, { track: true });

  const isEntitled = React.useMemo(() => !!plan && ENTITLED_PLANS.has(plan), [plan]);

  return (
    <Section icon="filter" title="General" description="Add a name and description for your assistant">
      <Section.Group>
        <Label>Name</Label>
        <Input value={title} onChangeText={setTitle} onBlur={withTargetValue(updateProperty('title'))} />
      </Section.Group>
      <Section.Group>
        <Label>Description</Label>
        <Input value={description} onChangeText={setDescription} onBlur={withTargetValue(updateProperty('description'))} />
      </Section.Group>
      <Section.Group>
        <Label>Chat Persistence</Label>
        <Select<VoiceflowVersion.ChatPersistence>
          value={config.persistence}
          onSelect={updateProperty('persistence')}
          options={PERSISTENCE_OPTIONS}
          getOptionLabel={(value) => value && PERSISTENCE_LABEL_MAP[value]}
          clearable={false}
        />
      </Section.Group>
      <Section.Group horizontal>
        <Box>
          <Label>Position</Label>
          <Select<VoiceflowVersion.ChatPosition>
            value={config.position}
            onSelect={updateProperty('position')}
            options={POSITION_OPTIONS}
            getOptionLabel={(value) => value && Utils.string.capitalizeFirstLetter(value)}
            clearable={false}
          />
        </Box>
        <Box>
          <Label>Side Spacing</Label>
          <Input type="number" value={sideSpacing} onChangeText={setSideSpacing} onBlur={updateSpacing} rightAction={PX_LABEL} />
        </Box>
        <Box>
          <Label>Bottom Spacing</Label>
          <Input type="number" value={bottomSpacing} onChangeText={setBottomSpacing} onBlur={updateSpacing} rightAction={PX_LABEL} />
        </Box>
      </Section.Group>
      <Section.Group>
        <Box.FlexApart>
          <div>
            <Box color={ThemeColor.PRIMARY} fontWeight={600}>
              Powered By
            </Box>
            <Text color={ThemeColor.SECONDARY} fontSize={13}>
              Display a Voiceflow link to help us spread the word.
            </Text>
          </div>
          <TippyTooltip
            disabled={isEntitled}
            position="bottom"
            html={
              <TippyTooltip.FooterButton buttonText="Upgrade to Pro" onClick={() => openPaymentModal()}>
                This is a Pro feature. Upgrade to remove Voiceflow branding.
              </TippyTooltip.FooterButton>
            }
            interactive
          >
            <Toggle size={Toggle.Size.EXTRA_SMALL} checked={!!config.watermark} disabled={!isEntitled} onChange={toggleWatermark} hasLabel />
          </TippyTooltip>
        </Box.FlexApart>
      </Section.Group>
    </Section>
  );
};
