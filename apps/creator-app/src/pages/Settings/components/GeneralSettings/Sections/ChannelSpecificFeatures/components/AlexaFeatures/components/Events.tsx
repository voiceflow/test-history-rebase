import { Box, Link, toast } from '@voiceflow/ui';
import React from 'react';

import AceEditor, { ACE_EDITOR_OPTIONS } from '@/components/AceEditor';
import * as Settings from '@/components/Settings';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { getErrorMessage } from '@/utils/error';

const AlexaEvents: React.FC = () => {
  const propAlexaEvents = useSelector(VersionV2.active.alexa.eventsSelector);
  const patchSettings = useDispatch(VersionV2.alexa.patchSettings);

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
    <Settings.SubSection header="Alexa Skill Events">
      <Box fullWidth>
        <Settings.SubSection.Description mb={16}>
          <Link href="https://developer.amazon.com/en-US/docs/alexa/smapi/skill-events-in-alexa-skills.html">
            Alexa Skill Events
          </Link>{' '}
          can be used to notify you if a certain event occurs, such as a user linking their account. The notification
          comes in form of a request to your Skill, which you can then act on.
        </Settings.SubSection.Description>

        {alexaEventError && (
          <Settings.SubSection.Description error mb={8}>
            {alexaEventError}
          </Settings.SubSection.Description>
        )}

        <AceEditor
          name="datasource_editor"
          mode="json"
          value={alexaEvents}
          onBlur={save}
          onChange={updateAlexaEvents}
          hasBorder
          fontSize={14}
          setOptions={ACE_EDITOR_OPTIONS}
          showGutter={true}
          editorProps={{ $blockScrolling: true }}
          placeholder="Input skill events JSON configuration"
          showPrintMargin={false}
          highlightActiveLine={true}
        />
      </Box>
    </Settings.SubSection>
  );
};

export default AlexaEvents;
