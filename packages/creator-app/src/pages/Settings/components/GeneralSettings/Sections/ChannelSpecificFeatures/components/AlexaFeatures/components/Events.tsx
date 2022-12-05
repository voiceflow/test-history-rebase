import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';
import React from 'react';

import AceEditor, { ACE_EDITOR_OPTIONS } from '@/components/AceEditor';
import Section, { SectionVariant } from '@/components/Section';
import * as Session from '@/ducks/session';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { SkillEventsErrorMessage } from '@/pages/Settings/components/styles';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';
import { ConnectedProps } from '@/types';

interface AlexaEventsOwnProps {
  platformMeta: PlatformSettingsMetaProps;
  modelSensitivityShown?: boolean;
}

const AlexaEvents: React.FC<ConnectedAlexaEvents & AlexaEventsOwnProps> = ({
  propAlexaEvents,
  platformMeta,
  patchSettings,
  modelSensitivityShown,
}) => {
  const { descriptors } = platformMeta;
  const { events } = descriptors;
  const gadgetsFeat = useFeature(Realtime.FeatureFlag.GADGETS);

  const [alexaEvents, setAlexaEvents] = React.useState(propAlexaEvents || '');
  const [alexaEventError, setAlexaEventError] = React.useState(null);

  const updateAlexaEvents = (value: string) => {
    try {
      if (value.trim()) {
        JSON.parse(value);
        setAlexaEventError(null);
      }
    } catch (error) {
      setAlexaEventError(error.toString());
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

const mapStateToProps = {
  propAlexaEvents: VersionV2.active.alexa.eventsSelector,
  projectID: Session.activeProjectIDSelector,
};

const mapDispatchToProps = {
  patchSettings: Version.alexa.patchSettings,
};

type ConnectedAlexaEvents = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(AlexaEvents) as React.FC<AlexaEventsOwnProps>;
