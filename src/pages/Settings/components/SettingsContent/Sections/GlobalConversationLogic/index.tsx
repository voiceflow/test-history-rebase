import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import SSML from '@/components/SSML';
import Section, { SectionToggleVariant, SectionVariant } from '@/components/Section';
import { ClickableText } from '@/components/Text';
import { toast } from '@/components/Toast';
import AudioUpload from '@/components/Upload/AudioUpload';
import { VoiceType } from '@/constants';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useDebouncedCallback, useDidUpdateEffect, useSyncedSmartReducer } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { ErrorMessage } from '@/pages/Settings/components';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';
import { ConnectedProps } from '@/types';

import {
  CONTINUE_SESSION_OPTIONS,
  FOLLOW_UP_OPTIONS,
  REPEAT_OPTIONS,
  RESUME_PROMPT_MAX_LENGTH,
  RESUME_PROMPT_OBJECT,
  SAVE_SETTINGS_DEBOUNCE_DELAY,
} from './constants';

const SSMLComponent: any = SSML;

const GlobalConversationLogic: React.FC<ConnectedGlobalConversationLogic & { platformMeta: PlatformSettingsMetaProps }> = ({
  meta,
  platformMeta,
  saveSettings,
}) => {
  const { descriptors } = platformMeta;
  const { continuePrevious, allowRepeat, repeatDialog, repeatEverything } = descriptors;
  const { resumePrompt: resumePromptMeta, repeat: repeatMeta, restart: restartMeta } = meta;
  const [state, actions] = useSyncedSmartReducer({
    previousSessionDialogError: false,
    resumePrompt: resumePromptMeta || RESUME_PROMPT_OBJECT,
    repeat: repeatMeta || 0,
    restart: restartMeta,
    hasFollowUp: !!(resumePromptMeta?.follow_content || RESUME_PROMPT_OBJECT.follow_voice),
    followUpType: resumePromptMeta?.follow_voice || RESUME_PROMPT_OBJECT.follow_voice,
    resumePromptType: resumePromptMeta?.voice || RESUME_PROMPT_OBJECT.voice,
  });

  const { setResumePrompt, setFollowUpType, setResumePromptType, setRestart, setRepeat, setHasFollowUp } = actions;

  const { resumePrompt, resumePromptType, repeat, followUpType, previousSessionDialogError, hasFollowUp, restart } = state;

  const updateResumePrompt = (val: string) => {
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

  const updateFollowUpVoice = (voice: string) => {
    setResumePrompt({ ...resumePrompt, follow_voice: voice });
  };

  const updateFollowUpContent = ({ text }: { text: string }) => {
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

  const updateResumePromptVoice = (voice: string) => {
    setResumePrompt({ ...resumePrompt, voice });
  };

  const save = useDebouncedCallback(SAVE_SETTINGS_DEBOUNCE_DELAY, async (data) => {
    await saveSettings(data, ['session', 'repeat']);
  });

  const updateData = async () => {
    const { repeat, restart, resumePrompt, hasFollowUp } = state;

    const settingsObject = {
      repeat,
      restart,
      resumePrompt,
    };

    if (!hasFollowUp) {
      delete settingsObject.resumePrompt.follow_content;
      delete settingsObject.resumePrompt.follow_voice;
    }

    try {
      if (previousSessionDialogError) throw new Error();
      await save(settingsObject);
    } catch (err) {
      toast.error('Settings Save Error');
    }
  };

  useDidUpdateEffect(() => {
    updateData();
  }, [restart, repeat, resumePrompt, hasFollowUp]);

  return (
    <>
      <Section
        contentPrefix={continuePrevious}
        variant={SectionVariant.QUATERNARY}
        collapseVariant={SectionToggleVariant.TOGGLE}
        header="Allow Users to Continue Previous Session"
        headerToggle
        initialOpen={!restart}
        onToggleChange={(val) => setRestart(val)}
      >
        <FormControl>
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
            <>
              <SSMLComponent
                voice={resumePrompt.voice}
                value={resumePrompt.content}
                onBlur={updateResumePromptContent}
                onChangeVoice={updateResumePromptVoice}
              />
              {previousSessionDialogError && <ErrorMessage>Confirmation message must not exceed 160 symbols.</ErrorMessage>}
            </>
          )}
          <ClickableText
            style={{ marginTop: '14px' }}
            onClick={() => {
              const newFollowUpBool = !hasFollowUp;
              setHasFollowUp(newFollowUpBool);
              if (newFollowUpBool) {
                updateFollowUpVoice(VoiceType.ALEXA);
              }
            }}
          >
            {hasFollowUp ? 'Remove Follow Up' : 'Add Follow Up'}
          </ClickableText>
        </FormControl>
        {hasFollowUp && (
          <Section isNested header="Resume Follow Up" isDividerNested variant={SectionVariant.QUATERNARY}>
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
                <AudioUpload
                  audio={resumePrompt.follow_content}
                  update={(val: string) => setResumePrompt({ ...resumePrompt, follow_content: val })}
                />
              </FormControl>
            ) : (
              <FormControl contentBottomUnits={3}>
                <SSMLComponent
                  voice={resumePrompt?.follow_voice || RESUME_PROMPT_OBJECT.follow_voice}
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
        contentPrefix={allowRepeat}
        variant={SectionVariant.QUATERNARY}
        collapseVariant={SectionToggleVariant.TOGGLE}
        header="Allow Users to Repeat"
        isDividerNested
        onToggleChange={(collapsed) => setRepeat(collapsed ? 0 : 1)}
        headerToggle
        initialOpen={repeat >= 1}
      >
        <FormControl contentBottomUnits={3}>
          <RadioGroup options={REPEAT_OPTIONS} name="multiple" checked={repeat || 1} onChange={setRepeat} />
          {repeat === 1 ? repeatDialog : repeatEverything}
        </FormControl>
      </Section>
    </>
  );
};

const mapStateToProps = {
  meta: Skill.skillMetaSelector,
};

const mapDispatchToProps = {
  saveSettings: Skill.saveSettings,
  saveProjectName: Skill.saveProjectName,
};

type ConnectedGlobalConversationLogic = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(GlobalConversationLogic);
