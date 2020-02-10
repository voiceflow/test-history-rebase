import React from 'react';

import ClipBoard from '@/components/ClipBoard/ClipBoard';
import Input from '@/components/Input';
import RadioGroup from '@/components/RadioGroup';
import SSML from '@/components/SSML';
import Section, { SectionToggleVariant } from '@/components/Section';
import ClickableText from '@/components/Text/ClickableText';
import { toast } from '@/components/Toast';
import AudioUpload from '@/components/Upload/AudioUpload';
import { INVOCATION_NAME_REGEX } from '@/constants';
import { activeSkillSelector, getImportToken, saveSkillSettings, skillMetaSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { useDebouncedCallback, useSyncedSmartReducer, useTeardown } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';

import ErrorMessage from './components/ErrorMessage';
import {
  CONTINUE_SESSION_OPTIONS,
  FOLLOW_UP_OPTIONS,
  REPEAT_OPTIONS,
  RESUME_PROMPT_MAX_LENGTH,
  RESUME_PROMPT_OBJECT,
  SAVE_SETTINGS_DEBOUNCE_DELAY,
} from './constants';

function Basic({ meta, skill, getImportToken, saveSkillSettings }) {
  const { invName: invNameMeta, resumePrompt: resumePromptMeta, repeat: repeatMeta, restart: restartMeta, importToken } = meta;
  const { name: nameSkill } = skill;

  const [state, actions] = useSyncedSmartReducer({
    invName: invNameMeta,
    invocationNameError: false,
    previousSessionDialogError: false,
    resumePrompt: resumePromptMeta || RESUME_PROMPT_OBJECT,
    repeat: repeatMeta || 0,
    restart: restartMeta,
    name: nameSkill,
    hasFollowUp: !!(resumePromptMeta?.follow_content || RESUME_PROMPT_OBJECT.follow_voice),
    followUpType: resumePromptMeta?.follow_voice || RESUME_PROMPT_OBJECT.follow_voice,
    resumePromptType: resumePromptMeta?.voice || RESUME_PROMPT_OBJECT.voice,
  });

  const { setResumePrompt, setName, setFollowUpType, setResumePromptType, setRestart, setRepeat, setHasFollowUp } = actions;

  const {
    resumePrompt,
    resumePromptType,
    repeat,
    followUpType,
    previousSessionDialogError,
    hasFollowUp,
    invocationNameError,
    invName,
    restart,
    name,
  } = state;

  const updateResumePrompt = (val) => {
    setResumePrompt({ ...resumePrompt, content: val });
  };

  const updateResumePromptContent = React.useCallback(
    ({ text }) => {
      if (text === resumePrompt.content) {
        return;
      }

      const valid = text.length <= RESUME_PROMPT_MAX_LENGTH;

      actions.update({
        previousSessionDialogError: !valid,
        resumePrompt: {
          ...resumePrompt,
          content: text,
        },
      });
    },
    [resumePrompt]
  );

  const updateFollowUpVoice = (voice) => {
    setResumePrompt({ ...resumePrompt, follow_voice: voice });
  };

  const updateFollowUpContent = ({ text }) => {
    if (text === resumePrompt.follow_content) {
      return;
    }

    actions.update({
      resumePrompt: {
        ...resumePrompt,
        follow_content: text,
      },
    });
  };

  const updateResumePromptVoice = (voice) => {
    setResumePrompt({ ...resumePrompt, voice });
  };

  const updateInvocationName = (val) => {
    const valid = !INVOCATION_NAME_REGEX.test(val);

    actions.update({
      invocationNameError: valid,
      invName: val,
    });
  };

  const saveSettings = useDebouncedCallback(SAVE_SETTINGS_DEBOUNCE_DELAY, async (data) => {
    await saveSkillSettings(data);
  });

  const updateData = React.useCallback(
    (settingsObject) => {
      try {
        if (invocationNameError || previousSessionDialogError) throw new Error();
        saveSettings(settingsObject);
      } catch (err) {
        toast.error('Settings Save Error');
      }
    },
    [invocationNameError, previousSessionDialogError]
  );

  useTeardown(() => {
    const { invName, name, repeat, restart, resumePrompt, hasFollowUp } = state;
    const settingsObject = {
      invName,
      name,
      repeat,
      restart,
      resumePrompt,
    };
    if (!hasFollowUp) {
      delete settingsObject.resumePrompt.follow_content;
      delete settingsObject.resumePrompt.follow_voice;
    }
    updateData(settingsObject);
  }, [invName, repeat, restart, name, resumePrompt, hasFollowUp]);

  React.useEffect(() => {
    getImportToken();
  }, [getImportToken]);

  return (
    <FormControl contentMarginBottomUnits={3}>
      <Section dividers={false} opened>
        <FormControl label="Project Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormControl>
        <FormControl label="Invocation Name" tooltip="The phrase you use to invoke your app " tooltipProps={{ portalNode: document.body }}>
          <Input error={invocationNameError} value={invName} onChange={(e) => updateInvocationName(e.target.value)} />
          {invocationNameError && (
            <ErrorMessage>Invocation name may only contain alphabetic characters, apostrophes, periods and spaces.</ErrorMessage>
          )}
        </FormControl>
      </Section>
      <Section
        collapseVariant={SectionToggleVariant.TOGGLE}
        header="Allow Users to Continue Previous Session"
        headerToggle={true}
        initialOpen={!restart}
        isDividerNested
        onToggleChange={(val) => setRestart(val)}
        tooltip={
          restart
            ? 'The project will restart from the beginning every time the user starts a session'
            : 'The project will resume from the last block the user was on before quitting'
        }
        tooltipProps={{ portalNode: document.body }}
      >
        <FormControl contentMarginBottomUnits={3}>
          <FormControl>
            <RadioGroup
              options={CONTINUE_SESSION_OPTIONS}
              name="multiple"
              checked={resumePromptType}
              onChange={(val) => {
                setResumePromptType(val);
                setResumePrompt({ ...resumePrompt, content: '', voice: val });
              }}
            />
          </FormControl>
          {resumePromptType === CONTINUE_SESSION_OPTIONS[1].id ? (
            <AudioUpload audio={resumePrompt.content} update={updateResumePrompt} />
          ) : (
            <FormControl>
              <SSML
                voice={resumePrompt.voice}
                value={resumePrompt.content}
                onBlur={updateResumePromptContent}
                onChangeVoice={updateResumePromptVoice}
              />
              {previousSessionDialogError && <ErrorMessage>Confirmation message must not exceed 160 symbols.</ErrorMessage>}
            </FormControl>
          )}
          <ClickableText onClick={() => setHasFollowUp(!hasFollowUp)}>Toggle Follow Up</ClickableText>
        </FormControl>
        {hasFollowUp && (
          <Section isNested header="Resume Follow Up" isDividerNested>
            <FormControl>
              <RadioGroup
                options={FOLLOW_UP_OPTIONS}
                name="multiple"
                checked={followUpType}
                onChange={(val) => {
                  setFollowUpType(val);
                  setResumePrompt({ ...resumePrompt, follow_content: '', follow_voice: val });
                }}
              />
            </FormControl>
            {followUpType === FOLLOW_UP_OPTIONS[1].id ? (
              <FormControl>
                <AudioUpload audio={resumePrompt.follow_content} update={(val) => setResumePrompt({ ...resumePrompt, follow_content: val })} />
              </FormControl>
            ) : (
              <FormControl>
                <SSML
                  voice={resumePrompt.follow_voice}
                  value={resumePrompt.follow_content}
                  onBlur={updateFollowUpContent}
                  onChangeVoice={updateFollowUpVoice}
                />
              </FormControl>
            )}
          </Section>
        )}
      </Section>
      <Section
        collapseVariant={SectionToggleVariant.TOGGLE}
        header="Allow Users to Repeat"
        isDividerNested
        onToggleChange={(collapsed) => setRepeat(collapsed ? 0 : 1)}
        headerToggle={true}
        initialOpen={repeat >= 1}
        tooltip="Users will be able to say repeat at any choice/interaction and the dialog will repeat"
        tooltipProps={{ portalNode: document.body }}
      >
        <FormControl contentMarginBottomUnits={3}>
          <RadioGroup options={REPEAT_OPTIONS} name="multiple" checked={repeat || 1} onChange={setRepeat} />
        </FormControl>
      </Section>
      <Section
        collapseVariant={SectionToggleVariant.ARROW}
        header="Downloadable Link"
        isDividerNested
        headerToggle={true}
        tooltip="This link allows someone to import this project into their Voiceflow Account"
        tooltipProps={{ portalNode: document.body }}
      >
        <ClipBoard name="link" value={`${window.location.origin}/dashboard?import=${importToken}`} id="shareLink" />
      </Section>
    </FormControl>
  );
}

const mapStateToProps = {
  meta: skillMetaSelector,
  skill: activeSkillSelector,
};

const mapDispatchToProps = {
  saveSkillSettings,
  getImportToken,
};

export default connect(mapStateToProps, mapDispatchToProps)(Basic);
