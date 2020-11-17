import React from 'react';

import AceEditor, { ACE_EDITOR_OPTIONS } from '@/components/AceEditor';
import Section, { SectionVariant } from '@/components/Section';
import { toast } from '@/components/Toast';
import { FeatureFlag } from '@/config/features';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { SkillEventsErrorMessage } from '@/pages/Settings/components';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';
import { ConnectedProps } from '@/types';

import AlexaGadgetsToggle from './components/AlexaGadgetsToggle';

const AceEditorComponent: any = AceEditor;

const AlexaFeatures: React.FC<ConnectedAlexaFeatures & { platformMeta: PlatformSettingsMetaProps }> = ({ meta, platformMeta, saveSettings }) => {
  const { alexaEvents: propAlexaEvents } = meta;
  const { descriptors } = platformMeta;
  const { events } = descriptors;
  const gadgetsFeat = useFeature(FeatureFlag.GADGETS);

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
    const settingsObject = {
      alexaEvents,
    };

    try {
      saveSettings(settingsObject, ['error', 'events']);
    } catch (err) {
      toast.error('Settings Save Error');
    }
  };
  return (
    <>
      <AlexaGadgetsToggle />
      <Section contentPrefix={events} header="Alexa Skill Events" isDividerNested={!!gadgetsFeat.isEnabled} variant={SectionVariant.QUATERNARY}>
        {alexaEventError && (
          <SkillEventsErrorMessage>
            <FormControl>{alexaEventError}</FormControl>
          </SkillEventsErrorMessage>
        )}
        <FormControl contentBottomUnits={3.2}>
          <AceEditorComponent
            hasBorder
            onBlur={save}
            name="datasource_editor"
            mode="json"
            theme="github"
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
    </>
  );
};

const mapStateToProps = {
  meta: Skill.skillMetaSelector,
  projectID: Skill.activeProjectIDSelector,
};

const mapDispatchToProps = {
  saveSettings: Skill.saveSettings,
};

type ConnectedAlexaFeatures = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(AlexaFeatures);
