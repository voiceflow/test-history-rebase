import { Nullish, Utils } from '@voiceflow/common';
import { PlanType } from '@voiceflow/internal';
import { Box, Input, Label, Select, Text, ThemeColor, TippyTooltip } from '@voiceflow/ui';
import { VoiceflowVersion } from '@voiceflow/voiceflow-types';
import React from 'react';

import { ENTERPRISE_LIMIT_PLANS, TEAM_LIMIT_PLANS } from '@/config/planLimitV2';
import { ModalType } from '@/constants';
import { patchPublishing } from '@/ducks/version/platform/general';
import * as Version from '@/ducks/versionV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useLinkedState, useModals, useSelector } from '@/hooks';
import { withTargetValue } from '@/utils/dom';

import type { Config } from '../types';
import Section from './components/Section';
import ToggleGroup from './components/ToggleGroup';

const ENTITLED_PLANS = new Set<PlanType>([...ENTERPRISE_LIMIT_PLANS, ...TEAM_LIMIT_PLANS]);

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
  const config: Config = useSelector(Version.active.general.chatPublishingSelector);
  const updateConfig = useDispatch(patchPublishing);

  const [title, setTitle] = useLinkedState(config.title);
  const [description, setDescription] = useLinkedState(config.description);
  const { open: openPaymentModal } = useModals(ModalType.PAYMENT);

  const updateProperty =
    <T extends keyof Config>(property: T) =>
    (value: Nullish<Config[T]>) => {
      if (Utils.array.isNotNullish(value)) updateConfig({ [property]: value });
    };

  const [sideSpacing, setSideSpacing] = useLinkedState(String(config.spacing?.side));
  const [bottomSpacing, setBottomSpacing] = useLinkedState(String(config.spacing?.bottom));

  const updateSpacing = () =>
    updateConfig({
      spacing: {
        side: Number(sideSpacing),
        bottom: Number(bottomSpacing),
      },
    });

  const toggleWatermark = () =>
    updateConfig({
      watermark: !config.watermark,
    });

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
            <ToggleGroup value={!!config.watermark} onToggle={toggleWatermark} disabled={!isEntitled} />
          </TippyTooltip>
        </Box.FlexApart>
      </Section.Group>
    </Section>
  );
};
