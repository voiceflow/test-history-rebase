import { BaseVersion } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { ClickableText, CONTEXT_MENU_IGNORED_CLASS_NAME, Upload } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import Section, { SectionToggleVariant, SectionVariant } from '@/components/Section';
import SSML from '@/components/SSML';
import VariablesInput from '@/components/VariablesInput';
import * as VersionDuck from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useAlexaProjectSettings, useDispatch, useSelector } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { ErrorMessage } from '@/pages/Settings/components';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';

import { REPEAT_OPTIONS, RESUME_PROMPT_MAX_LENGTH } from './constants';

const SSMLComponent: any = SSML;

interface AssistantConversationLogicProps {
  platform: VoiceflowConstants.PlatformType;
  projectType: VoiceflowConstants.ProjectType;
  platformMeta: PlatformSettingsMetaProps;
  defaultVoice: Realtime.AnyVoice;
  platformDefaultVoice: Realtime.AnyVoice;
}

const AssistantConversationLogic: React.FC<AssistantConversationLogicProps> = ({
  platform,
  projectType,
  platformMeta,
  defaultVoice,
  platformDefaultVoice,
}) => {
  const settings = useSelector(VersionV2.active.alexa.settingsSelector);
  const session = useSelector(VersionV2.active.sessionSelector);

  const patchSettings = useDispatch(VersionDuck.alexa.patchSettings);
  const patchSession = useDispatch(VersionDuck.patchSession);
  const updateResumePrompt = useDispatch(VersionDuck.updateResumePrompt);
  const updateDefaultVoice = useDispatch(VersionDuck.updateDefaultVoice);

  const canUseAlexaSettings = useAlexaProjectSettings();

  const { descriptors } = platformMeta;
  const { continuePrevious, allowRepeat, repeatDialog, repeatEverything } = descriptors;

  const defaultResumePrompt = React.useMemo(
    () => ({
      content: '',
      voice: defaultVoice,
      followContent: '',
      followVoice: defaultVoice,
    }),
    [defaultVoice]
  );

  const [previousSessionDialogError, setPreviousSessionDialogError] = React.useState(false);

  const repeat = settings?.repeat ?? BaseVersion.RepeatType.OFF;
  const restart = session?.restart || false;
  const resumePrompt = session?.resumePrompt || defaultResumePrompt;
  const followUpType = session?.resumePrompt.followVoice || defaultVoice;
  const resumePromptType = session?.resumePrompt.voice || defaultVoice;

  const onChangeResumePromptType = React.useCallback((resumePromptType: string) => {
    updateResumePrompt({ content: '', voice: resumePromptType });
  }, []);

  const onChangeFollowUpType = React.useCallback((followUpType: string) => {
    updateResumePrompt({ followContent: '', followVoice: followUpType });
  }, []);

  const onToggleHasFollowUp = React.useCallback(() => {
    if (resumePrompt?.followVoice) {
      updateResumePrompt({ followContent: undefined, followVoice: undefined });
    } else {
      updateResumePrompt({ followContent: undefined, followVoice: defaultVoice });
    }
  }, [resumePrompt?.followVoice, defaultVoice]);

  const onChangeResumePromptContent = React.useCallback(
    ({ text }) => {
      if (text === resumePrompt.content) {
        return;
      }

      const valid = text.length <= RESUME_PROMPT_MAX_LENGTH;

      updateResumePrompt({ content: text });
      setPreviousSessionDialogError(!valid);
    },
    [resumePrompt.content]
  );

  const onChangeFollowUpVoice = React.useCallback((voice: string) => {
    updateResumePrompt({ followVoice: voice });
  }, []);

  const onChangeFollowUpContent = React.useCallback(
    ({ text }: { text: string | null }) => {
      if (text === resumePrompt.followContent) {
        return;
      }

      updateResumePrompt({ followContent: text });
    },
    [resumePrompt.followContent]
  );

  const onChangeResumePromptVoice = React.useCallback((voice: string) => {
    updateResumePrompt({ voice });
  }, []);

  return (
    <>
      {canUseAlexaSettings && (
        <>
          <Section
            contentPrefix={continuePrevious}
            variant={SectionVariant.QUATERNARY}
            collapseVariant={SectionToggleVariant.TOGGLE}
            header="Allow Users to Continue Previous Session"
            headerToggle
            dividers
            isDividerNested
            initialOpen={!restart}
            onToggleChange={(nextRestart) => patchSession({ restart: nextRestart })}
          >
            <FormControl>
              <FormControl>
                <RadioGroup
                  options={[
                    { id: defaultVoice, label: 'Speak', customCheckedCondition: (val) => val !== VoiceflowConstants.Voice.AUDIO },
                    { id: VoiceflowConstants.Voice.AUDIO, label: 'Audio', customCheckedCondition: (val) => val === VoiceflowConstants.Voice.AUDIO },
                  ]}
                  name="multiple"
                  checked={resumePromptType}
                  onChange={onChangeResumePromptType}
                />
              </FormControl>

              {resumePromptType === VoiceflowConstants.Voice.AUDIO ? (
                <Upload.AudioUpload
                  audio={resumePrompt.content}
                  update={(src) => onChangeResumePromptContent({ text: src })}
                  className={CONTEXT_MENU_IGNORED_CLASS_NAME}
                  renderInput={VariablesInput.renderInput}
                />
              ) : (
                <>
                  <SSMLComponent
                    voice={resumePrompt.voice || defaultVoice}
                    value={resumePrompt.content || ''}
                    onBlur={onChangeResumePromptContent}
                    platform={platform}
                    projectType={projectType}
                    defaultVoice={defaultVoice}
                    onChangeVoice={onChangeResumePromptVoice}
                    platformDefaultVoice={platformDefaultVoice}
                    onChangeDefaultVoice={updateDefaultVoice}
                  />

                  {previousSessionDialogError && <ErrorMessage>Confirmation message must not exceed 160 symbols.</ErrorMessage>}
                </>
              )}

              <ClickableText style={{ marginTop: '14px' }} onClick={onToggleHasFollowUp}>
                {resumePrompt.followVoice ? 'Remove Follow Up' : 'Add Follow Up'}
              </ClickableText>
            </FormControl>

            {!!resumePrompt.followVoice && (
              <Section isNested header="Resume Follow Up" isDividerNested variant={SectionVariant.QUATERNARY}>
                <FormControl>
                  <RadioGroup
                    options={[
                      { id: defaultVoice, label: 'Speak', customCheckedCondition: (val) => val !== VoiceflowConstants.Voice.AUDIO },
                      { id: VoiceflowConstants.Voice.AUDIO, label: 'Audio', customCheckedCondition: (val) => val === VoiceflowConstants.Voice.AUDIO },
                    ]}
                    name="multiple"
                    checked={followUpType}
                    onChange={onChangeFollowUpType}
                  />
                </FormControl>

                {followUpType === VoiceflowConstants.Voice.AUDIO ? (
                  <FormControl>
                    <Upload.AudioUpload
                      renderInput={VariablesInput.renderInput}
                      audio={resumePrompt.followContent}
                      update={(src) => onChangeFollowUpContent({ text: src })}
                      className={CONTEXT_MENU_IGNORED_CLASS_NAME}
                    />
                  </FormControl>
                ) : (
                  <FormControl contentBottomUnits={3}>
                    <SSMLComponent
                      voice={resumePrompt.followVoice || defaultVoice}
                      value={resumePrompt.followContent || ''}
                      onBlur={onChangeFollowUpContent}
                      platform={platform}
                      projectType={projectType}
                      defaultVoice={defaultVoice}
                      onChangeVoice={onChangeFollowUpVoice}
                      platformDefaultVoice={platformDefaultVoice}
                      onChangeDefaultVoice={updateDefaultVoice}
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
            onToggleChange={(collapsed) => patchSettings({ repeat: collapsed ? BaseVersion.RepeatType.OFF : BaseVersion.RepeatType.DIALOG })}
            headerToggle
            initialOpen={repeat !== BaseVersion.RepeatType.OFF}
          >
            <FormControl contentBottomUnits={3}>
              <RadioGroup
                options={REPEAT_OPTIONS}
                name="multiple"
                checked={repeat ?? BaseVersion.RepeatType.DIALOG}
                onChange={(repeat) => patchSettings({ repeat })}
              />
              {repeat === BaseVersion.RepeatType.DIALOG ? repeatDialog : repeatEverything}
            </FormControl>
          </Section>
        </>
      )}
    </>
  );
};

export default AssistantConversationLogic;
