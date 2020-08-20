import React from 'react';

import AceEditor, { ACE_EDITOR_OPTIONS } from '@/components/AceEditor';
import RadioGroup from '@/components/RadioGroup';
import SSML from '@/components/SSML';
import Section, { SectionToggleVariant } from '@/components/Section';
import { toast } from '@/components/Toast';
import AudioUpload from '@/components/Upload/AudioUpload';
import { FeatureFlag } from '@/config/features';
import { activeProjectIDSelector, saveMeta, skillMetaSelector } from '@/ducks/skill';
import { saveAlexaSettings } from '@/ducks/skill/sideEffectsV2';
import { connect } from '@/hocs';
import { useDebouncedCallback, useFeature, useTeardown } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';

import { Settings, SkillEventsErrorMessage } from './components';
import { ERROR_PROMPT_OPTIONS, SAVE_SETTINGS_DEBOUNCE_DELAY } from './constants';

function Advanced({ meta, saveMeta, saveAlexaSettings }) {
  const { errorPrompt: propErrorPrompt, alexaEvents: propAlexaEvents } = meta;
  const gadgets = useFeature(FeatureFlag.GADGETS);
  const dataRefactor = useFeature(FeatureFlag.DATA_REFACTOR);

  const [alexaEvents, setAlexaEvents] = React.useState(propAlexaEvents || '');
  const [alexaEventError, setAlexaEventError] = React.useState(null);
  const [errorPrompt, setErrorPrompt] = React.useState(propErrorPrompt || { voice: 'Alexa', content: '' });
  const [errorPromptType, setErrorPromptType] = React.useState(errorPrompt.voice || ERROR_PROMPT_OPTIONS.voice);
  const [errorPromptEnabled] = React.useState(!!errorPrompt.content);

  const updateErrorPrompt = (val) => {
    setErrorPrompt({ ...errorPrompt, content: val });
  };

  const updateErrorPromptContent = React.useCallback(
    ({ text }) => {
      if (text === errorPrompt.content) {
        return;
      }

      setErrorPrompt({ ...errorPrompt, content: text });
    },
    [errorPrompt]
  );

  const saveSettings = useDebouncedCallback(SAVE_SETTINGS_DEBOUNCE_DELAY, saveMeta);

  const updateData = React.useCallback((settingsObject) => {
    try {
      if (dataRefactor.isEnabled) {
        saveAlexaSettings(settingsObject, ['error', 'events']);
      } else {
        saveSettings(settingsObject);
      }
    } catch (err) {
      toast.error('Settings Save Error');
    }
  }, []);

  const updateAlexaEvents = (value) => {
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

  useTeardown(() => {
    const settingsObject = {
      errorPrompt,
      alexaEvents,
    };
    updateData(settingsObject);
  }, [alexaEvents, errorPrompt]);

  return (
    <>
      <Section
        initialOpen={errorPromptEnabled}
        headerToggle
        variant="secondary"
        header="Error Prompt"
        dividers={false}
        onToggleChange={() => {
          setErrorPrompt({ content: '', voice: ERROR_PROMPT_OPTIONS[0].id });
        }}
        collapseVariant={SectionToggleVariant.TOGGLE}
      >
        <FormControl>
          <RadioGroup
            options={ERROR_PROMPT_OPTIONS}
            name="multiple"
            checked={errorPromptType}
            onChange={(val) => {
              setErrorPromptType(val);
              setErrorPrompt({ ...errorPrompt, content: '', voice: val });
            }}
          />
        </FormControl>
        {errorPromptType === ERROR_PROMPT_OPTIONS[1].id ? (
          <AudioUpload audio={errorPrompt.content} update={updateErrorPrompt} />
        ) : (
          <>
            <SSML
              voice={errorPrompt.voice}
              value={errorPrompt.content}
              onBlur={updateErrorPromptContent}
              onChangeVoice={(voice) => setErrorPrompt({ ...errorPrompt, voice })}
            />
          </>
        )}
      </Section>
      {gadgets && <Settings />}
      <Section header="Skill Events" variant="secondary" isDividerNested opened>
        {alexaEventError && (
          <SkillEventsErrorMessage>
            <FormControl>{alexaEventError}</FormControl>
          </SkillEventsErrorMessage>
        )}
        <FormControl contentBottomUnits={4}>
          <AceEditor
            name="datasource_editor"
            mode="json"
            theme="github"
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
}

const mapStateToProps = {
  meta: skillMetaSelector,
  projectID: activeProjectIDSelector,
};

const mapDispatchToProps = {
  saveMeta,
  saveAlexaSettings,
};

export default connect(mapStateToProps, mapDispatchToProps)(Advanced);
