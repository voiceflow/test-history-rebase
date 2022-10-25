import { Box, Input, Label, Text, ThemeColor } from '@voiceflow/ui';
import React from 'react';

import * as VoiceflowVersion from '@/ducks/version/platform/general';
import * as Version from '@/ducks/versionV2';
import { useDispatch, useLinkedState, useSelector } from '@/hooks';
import { withTargetValue } from '@/utils/dom';

import type { Config } from '../types';
import Section from './components/Section';
import ToggleGroup from './components/ToggleGroup';

export const GeneralSection: React.FC = () => {
  const config: Config = useSelector(Version.active.general.chatPublishingSelector);
  const updateConfig = useDispatch(VoiceflowVersion.patchPublishing);

  const [title, setTitle] = useLinkedState(config.title);
  const [description, setDescription] = useLinkedState(config.description);

  return (
    <Section icon="filter" title="General" description="Add a name and description for your assistant">
      <Section.Group>
        <Label>Name</Label>
        <Input value={title} onChangeText={setTitle} onBlur={withTargetValue((title) => updateConfig({ title }))} />
      </Section.Group>
      <Section.Group>
        <Label>Description</Label>
        <Input value={description} onChangeText={setDescription} onBlur={withTargetValue((description) => updateConfig({ description }))} />
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
          <ToggleGroup value={true} onToggle={() => {}} />
        </Box.FlexApart>
      </Section.Group>
    </Section>
  );
};
