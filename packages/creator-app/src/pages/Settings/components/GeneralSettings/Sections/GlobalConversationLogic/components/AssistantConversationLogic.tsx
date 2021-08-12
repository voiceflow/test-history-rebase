import { RepeatType, Voice as GeneralVoice } from '@voiceflow/general-types';
import { PlatformType } from '@voiceflow/internal';
import { ClickableText } from '@voiceflow/ui';
import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import Section, { SectionToggleVariant, SectionVariant } from '@/components/Section';
import SSML from '@/components/SSML';
import AudioUpload from '@/components/Upload/AudioUpload';
import * as VersionDuck from '@/ducks/version';
import { connect } from '@/hocs';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { ErrorMessage } from '@/pages/Settings/components';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';
import { ConnectedProps } from '@/types';

import { REPEAT_OPTIONS, RESUME_PROMPT_MAX_LENGTH } from '../constants';

const SSMLComponent: any = SSML;

interface AssistantConversationLogicProps {
  platform: PlatformType;
  platformMeta: PlatformSettingsMetaProps;
  defaultVoice: VersionDuck.AnyVoice;
  platformDefaultVoice: VersionDuck.AnyVoice;
}

const AssistantConversationLogic: React.FC<ConnectedAssistantConversationLogic & AssistantConversationLogicProps> = ({
  settings,
  session,
  platform,
  platformMeta,
  defaultVoice,
  platformDefaultVoice,
  saveSettings,
  saveSession,
  saveResumePrompt,
  saveDefaultVoice,
}) => {
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

  const repeat = settings?.repeat ?? RepeatType.OFF;
  const restart = session?.restart || false;
  const resumePrompt = session?.resumePrompt || defaultResumePrompt;
  const followUpType = session?.resumePrompt.followVoice || defaultVoice;
  const resumePromptType = session?.resumePrompt.voice || defaultVoice;

  const onChangeResumePromptType = React.useCallback((resumePromptType: string) => {
    saveResumePrompt({ content: '', voice: resumePromptType });
  }, []);

  const onChangeFollowUpType = React.useCallback((followUpType: string) => {
    saveResumePrompt({ followContent: '', followVoice: followUpType });
  }, []);

  const onToggleHasFollowUp = React.useCallback(() => {
    if (resumePrompt?.followVoice) {
      saveResumePrompt({ followContent: undefined, followVoice: undefined });
    } else {
      saveResumePrompt({ followContent: undefined, followVoice: defaultVoice });
    }
  }, [resumePrompt?.followVoice, defaultVoice]);

  const onChangeResumePromptContent = React.useCallback(
    ({ text }) => {
      if (text === resumePrompt.content) {
        return;
      }

      const valid = text.length <= RESUME_PROMPT_MAX_LENGTH;

      saveResumePrompt({ content: text });
      setPreviousSessionDialogError(!valid);
    },
    [resumePrompt.content]
  );

  const onChangeFollowUpVoice = React.useCallback((voice: string) => {
    saveResumePrompt({ followVoice: voice });
  }, []);

  const onChangeFollowUpContent = React.useCallback(
    ({ text }: { text: string }) => {
      if (text === resumePrompt.followContent) {
        return;
      }

      saveResumePrompt({ followContent: text });
    },
    [resumePrompt.followContent]
  );

  const onChangeResumePromptVoice = React.useCallback((voice: string) => {
    saveResumePrompt({ voice });
  }, []);

  return (
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
        onToggleChange={(nextRestart) => saveSession({ restart: nextRestart })}
      >
        <FormControl>
          <FormControl>
            <RadioGroup
              options={[
                { id: defaultVoice, label: 'Speak', customCheckedCondition: (val) => val !== GeneralVoice.AUDIO },
                { id: GeneralVoice.AUDIO, label: 'Audio', customCheckedCondition: (val) => val === GeneralVoice.AUDIO },
              ]}
              name="multiple"
              checked={resumePromptType}
              onChange={onChangeResumePromptType}
            />
          </FormControl>

          {resumePromptType === GeneralVoice.AUDIO ? (
            <AudioUpload audio={resumePrompt.content} update={(src: string) => onChangeResumePromptContent({ text: src })} />
          ) : (
            <>
              <SSMLComponent
                voice={resumePrompt.voice || defaultVoice}
                value={resumePrompt.content || ''}
                onBlur={onChangeResumePromptContent}
                platform={platform}
                defaultVoice={defaultVoice}
                onChangeVoice={onChangeResumePromptVoice}
                platformDefaultVoice={platformDefaultVoice}
                onChangeDefaultVoice={saveDefaultVoice}
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
                  { id: defaultVoice, label: 'Speak', customCheckedCondition: (val) => val !== GeneralVoice.AUDIO },
                  { id: GeneralVoice.AUDIO, label: 'Audio', customCheckedCondition: (val) => val === GeneralVoice.AUDIO },
                ]}
                name="multiple"
                checked={followUpType}
                onChange={onChangeFollowUpType}
              />
            </FormControl>

            {followUpType === GeneralVoice.AUDIO ? (
              <FormControl>
                <AudioUpload audio={resumePrompt.followContent} update={(src: string) => onChangeFollowUpContent({ text: src })} />
              </FormControl>
            ) : (
              <FormControl contentBottomUnits={3}>
                <SSMLComponent
                  voice={resumePrompt.followVoice || defaultVoice}
                  value={resumePrompt.followContent || ''}
                  onBlur={onChangeFollowUpContent}
                  platform={platform}
                  defaultVoice={defaultVoice}
                  onChangeVoice={onChangeFollowUpVoice}
                  platformDefaultVoice={platformDefaultVoice}
                  onChangeDefaultVoice={saveDefaultVoice}
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
        onToggleChange={(collapsed) => saveSettings({ repeat: collapsed ? RepeatType.OFF : RepeatType.DIALOG })}
        headerToggle
        initialOpen={repeat !== RepeatType.OFF}
      >
        <FormControl contentBottomUnits={3}>
          <RadioGroup
            options={REPEAT_OPTIONS}
            name="multiple"
            checked={repeat ?? RepeatType.DIALOG}
            onChange={(repeat) => saveSettings({ repeat })}
          />
          {repeat === RepeatType.DIALOG ? repeatDialog : repeatEverything}
        </FormControl>
      </Section>
    </>
  );
};

const mapStateToProps = {
  settings: VersionDuck.alexa.activeSettingsSelector,
  session: VersionDuck.activeSessionSelector,
};

const mapDispatchToProps = {
  saveSettings: VersionDuck.alexa.saveSettings,
  saveSession: VersionDuck.saveSession,
  saveResumePrompt: VersionDuck.saveResumePrompt,
  saveDefaultVoice: VersionDuck.saveDefaultVoice,
};

type ConnectedAssistantConversationLogic = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(AssistantConversationLogic) as React.FC<AssistantConversationLogicProps>;
