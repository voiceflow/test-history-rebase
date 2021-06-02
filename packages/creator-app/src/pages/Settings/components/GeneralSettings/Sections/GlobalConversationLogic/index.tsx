import { Voice as AlexaVoice } from '@voiceflow/alexa-types';
import { RepeatType, Voice as GeneralVoice } from '@voiceflow/general-types';
import { Voice as GoogleVoice } from '@voiceflow/google-types';
import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import Section, { SectionToggleVariant, SectionVariant } from '@/components/Section';
import Select from '@/components/Select';
import SSML from '@/components/SSML';
import { ClickableText } from '@/components/Text';
import AudioUpload from '@/components/Upload/AudioUpload';
import { PlatformType } from '@/constants';
import * as Version from '@/ducks/version';
import { connect } from '@/hocs';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { ErrorMessage } from '@/pages/Settings/components';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';
import { ConnectedProps, MergeArguments } from '@/types';
import { getPlatformDefaultVoice, getPlatformValue } from '@/utils/platform';

import { REPEAT_OPTIONS, RESUME_PROMPT_MAX_LENGTH } from './constants';

const SSMLComponent: any = SSML;

type GlobalConversationLogicProps = {
  platform: PlatformType;
  platformMeta: PlatformSettingsMetaProps;
};

const GlobalConversationLogic: React.FC<ConnectedGlobalConversationLogic & GlobalConversationLogicProps> = ({
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

  const platformVoices = React.useMemo(() => {
    const voices = getPlatformValue<string[]>(
      platform,
      {
        [PlatformType.ALEXA]: Object.values(AlexaVoice),
        [PlatformType.GOOGLE]: Object.values(GoogleVoice),
      },
      Object.values(GeneralVoice)
    );
    return voices.filter((voice) => voice !== 'audio');
  }, [platform]);

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

  const withDefaultVoice = platformVoices.length >= 2;

  return (
    <>
      {withDefaultVoice && (
        <Section
          header="Default Voice"
          variant={SectionVariant.QUATERNARY}
          dividers={false}
          contentSuffix={descriptors.defaultVoice}
          customContentStyling={{ paddingBottom: '24px' }}
        >
          <Select value={defaultVoice} options={platformVoices} onSelect={saveDefaultVoice} searchable placeholder={defaultVoice} />
        </Section>
      )}

      <Section
        contentPrefix={continuePrevious}
        variant={SectionVariant.QUATERNARY}
        collapseVariant={SectionToggleVariant.TOGGLE}
        header="Allow Users to Continue Previous Session"
        headerToggle
        dividers={withDefaultVoice}
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
  settings: Version.alexa.activeSettingsSelector,
  session: Version.activeSessionSelector,
  defaultVoice: Version.activeDefaultVoiceSelector,
};

const mapDispatchToProps = {
  saveSettings: Version.alexa.saveSettings,
  saveSession: Version.saveSession,
  saveResumePrompt: Version.saveResumePrompt,
  saveDefaultVoice: Version.saveDefaultVoice,
};

const mergeProps = (
  ...[{ defaultVoice }, , { platform }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps, GlobalConversationLogicProps>
) => {
  const platformDefaultVoice = getPlatformDefaultVoice(platform);

  return {
    platformDefaultVoice,
    defaultVoice: defaultVoice || platformDefaultVoice,
  };
};

type ConnectedGlobalConversationLogic = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(GlobalConversationLogic);
