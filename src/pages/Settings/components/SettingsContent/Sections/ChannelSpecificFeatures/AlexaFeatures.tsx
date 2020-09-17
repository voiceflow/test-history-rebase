import React from 'react';

import AceEditor, { ACE_EDITOR_OPTIONS } from '@/components/AceEditor';
import Section, { SectionVariant } from '@/components/Section';
import { toast } from '@/components/Toast';
import { FeatureFlag } from '@/config/features';
import { activeProjectIDSelector, saveMeta, skillMetaSelector } from '@/ducks/skill';
import { saveAlexaSettings } from '@/ducks/skill/sideEffectsV2';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { SkillEventsErrorMessage } from '@/pages/Settings/components';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';
import { ConnectedProps } from '@/types';

import AlexaGadgetsToggle from './components/AlexaGadgetsToggle';

const AceEditorComponent: any = AceEditor;

const AlexaFeatures: React.FC<ConnectedAlexaFeatures & { platformMeta: PlatformSettingsMetaProps }> = ({
  meta,
  platformMeta,
  saveMeta,
  saveAlexaSettings,
}) => {
  const { alexaEvents: propAlexaEvents } = meta;
  const { descriptors } = platformMeta;
  const { events } = descriptors;
  const dataRefactor = useFeature(FeatureFlag.DATA_REFACTOR);
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

  const saveSettings = async () => {
    const settingsObject = {
      alexaEvents,
    };

    try {
      if (dataRefactor.isEnabled) {
        saveAlexaSettings(settingsObject, ['error', 'events']);
      } else {
        saveMeta(settingsObject);
      }
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
            onBlur={saveSettings}
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
  meta: skillMetaSelector,
  projectID: activeProjectIDSelector,
};

const mapDispatchToProps = {
  saveMeta,
  saveAlexaSettings,
};

type ConnectedAlexaFeatures = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(AlexaFeatures);
