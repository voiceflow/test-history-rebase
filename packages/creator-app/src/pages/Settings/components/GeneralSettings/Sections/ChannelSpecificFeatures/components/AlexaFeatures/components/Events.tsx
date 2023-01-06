import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';
import React from 'react';

import AceEditor, { ACE_EDITOR_OPTIONS } from '@/components/AceEditor';
import Section, { SectionVariant } from '@/components/Section';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useFeature } from '@/hooks';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { SkillEventsErrorMessage } from '@/pages/Settings/components/styles';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';
import { getErrorMessage } from '@/utils/error';

interface AlexaEventsOwnProps {
  platformMeta: PlatformSettingsMetaProps;
  modelSensitivityShown?: boolean;
}

const AlexaEvents: React.OldFC<AlexaEventsOwnProps> = ({ platformMeta, modelSensitivityShown }) => {
  const propAlexaEvents = useSelector(VersionV2.active.alexa.eventsSelector);
  const patchSettings = useDispatch(Version.alexa.patchSettings);

  const { descriptors } = platformMeta;
  const { events } = descriptors;
  const gadgetsFeat = useFeature(Realtime.FeatureFlag.GADGETS);

  const [alexaEvents, setAlexaEvents] = React.useState(propAlexaEvents || '');
  const [alexaEventError, setAlexaEventError] = React.useState<string | null>(null);

  const updateAlexaEvents = (value: string) => {
    try {
      if (value.trim()) {
        JSON.parse(value);
        setAlexaEventError(null);
      }
    } catch (error) {
      setAlexaEventError(getErrorMessage(error));
    }
    setAlexaEvents(value);
  };

  const save = async () => {
    try {
      await patchSettings({ events: alexaEvents });
    } catch (err) {
      toast.error('Settings Save Error');
    }
  };
  return (
    <Section
      contentPrefix={events}
      header="Alexa Skill Events"
      variant={SectionVariant.QUATERNARY}
      dividers={gadgetsFeat.isEnabled || modelSensitivityShown}
      isDividerNested
    >
      {alexaEventError && (
        <SkillEventsErrorMessage>
          <FormControl>{alexaEventError}</FormControl>
        </SkillEventsErrorMessage>
      )}
      <FormControl contentBottomUnits={3.2}>
        <AceEditor
          hasBorder
          onBlur={save}
          name="datasource_editor"
          mode="json"
          placeholder="Input skill events JSON configuration"
          onChange={updateAlexaEvents}
          fontSize={14}
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={true}
          value={alexaEvents}
          editorProps={{ $blockScrolling: true }}
          setOptions={ACE_EDITOR_OPTIONS}
        />
      </FormControl>
    </Section>
  );
};

export default AlexaEvents;
