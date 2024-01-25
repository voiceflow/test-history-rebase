import { Nullish, Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Input, SectionV2, Select, TippyTooltip, Toggle } from '@voiceflow/ui';
import { VoiceflowVersion } from '@voiceflow/voiceflow-types';
import React from 'react';

import * as Settings from '@/components/Settings';
import { PRO_PLUS_PLANS } from '@/constants';
import * as VersionV2 from '@/ducks/versionV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useFeature, useLinkedState, useSelector } from '@/hooks';
import { usePaymentModal } from '@/hooks/modal.hook';
import { withTargetValue } from '@/utils/dom';
import { isPlanFactory } from '@/utils/plans';

import Section from './components/Section';

const PERSISTENCE_LABEL_MAP: Record<string, string> = {
  [VoiceflowVersion.ChatPersistence.LOCAL_STORAGE]: 'Never forget',
  [VoiceflowVersion.ChatPersistence.MEMORY]: 'Forget after tab closed or reloaded',
};
const PERSISTENCE_OPTIONS = Object.keys(PERSISTENCE_LABEL_MAP) as VoiceflowVersion.ChatPersistence[];

const POSITION_OPTIONS = Object.values(VoiceflowVersion.ChatPosition);

const pxLabel = (
  <SectionV2.Title bold fill={false} secondary>
    PX
  </SectionV2.Title>
);

export const GeneralSection: React.FC = () => {
  const plan = useSelector(WorkspaceV2.active.planSelector);
  const config = useSelector(VersionV2.active.voiceflow.chat.publishingSelector);
  const updateConfig = useDispatch(VersionV2.voiceflow.chat.patchActiveAndLivePublishing);

  const paymentModal = usePaymentModal();
  const [title, setTitle] = useLinkedState(config.title);
  const [description, setDescription] = useLinkedState(config.description);

  const updateProperty =
    <T extends keyof Platform.Voiceflow.Chat.Models.Version.Publishing.Model>(property: T) =>
    (value: Nullish<Platform.Voiceflow.Chat.Models.Version.Publishing.Model[T]>) => {
      if (Utils.array.isNotNullish(value)) updateConfig({ [property]: value }, { track: true });
    };

  const [sideSpacing, setSideSpacing] = useLinkedState(String(config.spacing?.side));
  const [bottomSpacing, setBottomSpacing] = useLinkedState(String(config.spacing?.bottom));

  const chatUIFeedbackButtons = useFeature(Realtime.FeatureFlag.CHAT_UI_FEEDBAK_BUTTONS);

  const updateSpacing = () => updateConfig({ spacing: { side: Number(sideSpacing), bottom: Number(bottomSpacing) } }, { track: true });

  const toggleWatermark = () => updateConfig({ watermark: !config.watermark }, { track: true });
  const toggleFeedback = () => updateConfig({ feedback: !config.feedback }, { track: false });

  const isEntitled = React.useMemo(() => !!plan && isPlanFactory(PRO_PLUS_PLANS)(plan), [plan]);

  return (
    <Section icon="filter" title="General" description="Add a name and description for your assistant">
      <Settings.SubSection header="Name" headerProps={{ px: 0, pt: 0 }} contentProps={{ px: 0 }}>
        <Input value={title} onChangeText={setTitle} onBlur={withTargetValue(updateProperty('title'))} />
      </Settings.SubSection>

      <Settings.SubSection header="Description" headerProps={{ px: 0, pt: 0 }} contentProps={{ px: 0 }}>
        <Input value={description} onChangeText={setDescription} onBlur={withTargetValue(updateProperty('description'))} />
      </Settings.SubSection>

      <Settings.SubSection header="Chat Persistence" headerProps={{ px: 0, pt: 0 }} contentProps={{ px: 0 }}>
        <Select<VoiceflowVersion.ChatPersistence>
          value={config.persistence}
          onSelect={updateProperty('persistence')}
          options={PERSISTENCE_OPTIONS}
          getOptionLabel={(value) => value && PERSISTENCE_LABEL_MAP[value]}
          clearable={false}
        />
      </Settings.SubSection>

      <Box.FlexApart gap={16}>
        <Settings.SubSection header="Position" headerProps={{ px: 0, pt: 0 }} contentProps={{ px: 0 }}>
          <Select<VoiceflowVersion.ChatPosition>
            value={config.position}
            onSelect={updateProperty('position')}
            options={POSITION_OPTIONS}
            getOptionLabel={(value) => value && Utils.string.capitalizeFirstLetter(value)}
            clearable={false}
          />
        </Settings.SubSection>

        <Settings.SubSection header="Side Spacing" headerProps={{ px: 0, pt: 0 }} contentProps={{ px: 0 }}>
          <Input type="number" value={sideSpacing} onChangeText={setSideSpacing} onBlur={updateSpacing} rightAction={pxLabel} />
        </Settings.SubSection>

        <Settings.SubSection header="Bottom Spacing" headerProps={{ px: 0, pt: 0 }} contentProps={{ px: 0 }}>
          <Input type="number" value={bottomSpacing} onChangeText={setBottomSpacing} onBlur={updateSpacing} rightAction={pxLabel} />
        </Settings.SubSection>
      </Box.FlexApart>

      <Settings.SubSection headerProps={{ px: 0, pt: 0 }} contentProps={{ px: 0, pb: 0 }}>
        <Box.FlexApart gap={24}>
          <div>
            <Settings.SubSection.Title>Powered By</Settings.SubSection.Title>
            <Settings.SubSection.Description>Display a Voiceflow link to help us spread the word.</Settings.SubSection.Description>
          </div>

          <TippyTooltip
            width={232}
            disabled={isEntitled}
            position="bottom"
            interactive
            content={
              <TippyTooltip.FooterButton buttonText="Upgrade to Pro" onClick={() => paymentModal.openVoid({})}>
                This is a Pro feature. Upgrade to remove Voiceflow branding.
              </TippyTooltip.FooterButton>
            }
          >
            <Toggle size={Toggle.Size.EXTRA_SMALL} checked={!!config.watermark} disabled={!isEntitled} onChange={toggleWatermark} hasLabel />
          </TippyTooltip>
        </Box.FlexApart>
      </Settings.SubSection>

      {chatUIFeedbackButtons.isEnabled && (
        <Settings.SubSection headerProps={{ px: 0 }} contentProps={{ px: 0, pt: 24, pb: 0 }}>
          <Box.FlexApart gap={24}>
            <div>
              <Settings.SubSection.Title>Ai Feedback</Settings.SubSection.Title>
              <Settings.SubSection.Description>Enables collecting feedback from ai system messages.</Settings.SubSection.Description>
            </div>

            <Toggle size={Toggle.Size.EXTRA_SMALL} checked={!!config.feedback} onChange={toggleFeedback} hasLabel />
          </Box.FlexApart>
        </Settings.SubSection>
      )}
    </Section>
  );
};
