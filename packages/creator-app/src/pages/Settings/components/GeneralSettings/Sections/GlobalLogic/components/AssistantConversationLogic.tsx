import { BaseVersion } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import { Box, ClickableText, CONTEXT_MENU_IGNORED_CLASS_NAME, SectionV2, Toggle, Upload } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import { SettingsSubSection } from '@/components/Settings/components';
import SSML from '@/components/SSML';
import VariablesInput from '@/components/VariablesInput';
import * as VersionDuck from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useAlexaProjectSettings } from '@/hooks/project';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { ErrorMessage } from '@/pages/Settings/components/styles';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';

import { REPEAT_OPTIONS, RESUME_PROMPT_MAX_LENGTH } from '../constants';

const SSMLComponent: any = SSML;

interface AssistantConversationLogicProps {
  platform: Platform.Constants.PlatformType;
  projectType: Platform.Constants.ProjectType;
  platformMeta: PlatformSettingsMetaProps;
  defaultVoice: string;
  platformDefaultVoice: string;
}

const AssistantConversationLogic: React.OldFC<AssistantConversationLogicProps> = ({
  platform,
  projectType,
  platformMeta,
  defaultVoice,
  platformDefaultVoice,
}) => {
  const session = useSelector(VersionV2.active.voice.sessionSelector);
  const settings = useSelector(VersionV2.active.voice.settingsSelector);

  const patchSession = useDispatch(VersionDuck.patchSession);
  const patchSettings = useDispatch(VersionDuck.patchSettings);
  const updateDefaultVoice = useDispatch(VersionDuck.voice.updateDefaultVoice);

  const canUseAlexaSettings = useAlexaProjectSettings();

  const defaultResumePrompt = React.useMemo(
    () => ({ voice: defaultVoice, content: '', followVoice: defaultVoice, followContent: null }),
    [defaultVoice]
  );

  const repeat = settings?.repeat ?? BaseVersion.RepeatType.OFF;
  const restart = session?.restart || false;
  const resumePrompt = session?.resumePrompt ?? defaultResumePrompt;

  const { descriptors } = platformMeta;
  const { continuePrevious, allowRepeat, repeatDialog, repeatEverything } = descriptors;

  const onChangeResumePrompt = (value: Partial<Platform.Common.Voice.Models.Version.SessionResumePrompt<string>>) =>
    patchSession({ resumePrompt: { ...resumePrompt, ...value } });

  const onToggleFollowUp = () =>
    onChangeResumePrompt(resumePrompt?.followVoice ? { followContent: null, followVoice: null } : { followContent: null, followVoice: defaultVoice });

  return !canUseAlexaSettings ? null : (
    <>
      <SectionV2.Divider />
      <SettingsSubSection header="Allow Users to Continue Previous Session" rightDescription={continuePrevious}>
        <Toggle checked={restart} size={Toggle.Size.SMALL} onChange={() => patchSession({ restart: !restart })} hasLabel />
      </SettingsSubSection>

      {restart && (
        <>
          <SettingsSubSection growInput={false} radioButton>
            <Box width="318px">
              <RadioGroup
                options={[
                  { id: false, label: 'Speak' },
                  {
                    id: true,
                    label: 'Audio',
                  },
                ]}
                name="multiple"
                checked={resumePrompt.voice === VoiceflowConstants.Voice.AUDIO}
                onChange={(checked) => onChangeResumePrompt({ content: '', voice: checked ? VoiceflowConstants.Voice.AUDIO : defaultVoice })}
                activeBar
                column
                noPaddingLastItem={false}
              />
            </Box>
          </SettingsSubSection>

          {resumePrompt.voice === VoiceflowConstants.Voice.AUDIO ? (
            <SettingsSubSection>
              <Upload.AudioUpload
                audio={resumePrompt.content}
                update={(src) => onChangeResumePrompt({ content: src ?? '' })}
                className={CONTEXT_MENU_IGNORED_CLASS_NAME}
                renderInput={VariablesInput.renderInput}
              />
            </SettingsSubSection>
          ) : (
            <SettingsSubSection>
              <SSMLComponent
                voice={resumePrompt.voice || defaultVoice}
                value={resumePrompt.content || ''}
                onBlur={({ text }: { text: string }) => onChangeResumePrompt({ content: text })}
                platform={platform}
                projectType={projectType}
                defaultVoice={defaultVoice}
                onChangeVoice={(voice: string) => onChangeResumePrompt({ voice })}
                platformDefaultVoice={platformDefaultVoice}
                onChangeDefaultVoice={updateDefaultVoice}
              />

              {resumePrompt.content.length >= RESUME_PROMPT_MAX_LENGTH && (
                <ErrorMessage>Confirmation message must not exceed 160 symbols.</ErrorMessage>
              )}
            </SettingsSubSection>
          )}

          <SettingsSubSection>
            <ClickableText style={{ marginTop: '14px' }} onClick={onToggleFollowUp}>
              {resumePrompt.followVoice ? 'Remove Follow Up' : 'Add Follow Up'}
            </ClickableText>
          </SettingsSubSection>

          {!!resumePrompt.followVoice && (
            <>
              <SectionV2.Divider inset />
              <SettingsSubSection header="Resume Follow Up" topOffset={0} radioButton>
                <Box width="318px">
                  <RadioGroup
                    options={[
                      { id: false, label: 'Speak' },
                      {
                        id: true,
                        label: 'Audio',
                      },
                    ]}
                    name="multiple"
                    checked={resumePrompt.followVoice === VoiceflowConstants.Voice.AUDIO}
                    onChange={(checked) =>
                      onChangeResumePrompt({ followContent: '', followVoice: checked ? VoiceflowConstants.Voice.AUDIO : defaultVoice })
                    }
                    activeBar
                    column
                    noPaddingLastItem={false}
                  />
                </Box>
              </SettingsSubSection>

              {resumePrompt.followVoice === VoiceflowConstants.Voice.AUDIO ? (
                <SettingsSubSection>
                  <Upload.AudioUpload
                    renderInput={VariablesInput.renderInput}
                    audio={resumePrompt.followContent}
                    update={(src) => onChangeResumePrompt({ followContent: src })}
                    className={CONTEXT_MENU_IGNORED_CLASS_NAME}
                  />
                </SettingsSubSection>
              ) : (
                <SettingsSubSection>
                  <SSMLComponent
                    voice={resumePrompt.followVoice || defaultVoice}
                    value={resumePrompt.followContent || ''}
                    onBlur={({ text }: { text: string }) => onChangeResumePrompt({ followContent: text })}
                    platform={platform}
                    projectType={projectType}
                    defaultVoice={defaultVoice}
                    onChangeVoice={(followVoice: string) => onChangeResumePrompt({ followVoice })}
                    platformDefaultVoice={platformDefaultVoice}
                    onChangeDefaultVoice={updateDefaultVoice}
                  />
                </SettingsSubSection>
              )}
            </>
          )}
        </>
      )}

      <SectionV2.Divider />

      <SettingsSubSection header="Allow Users to Repeat" customHeaderStyling={{ paddingBottom: '4px' }} rightDescription={allowRepeat || <></>}>
        <Toggle
          checked={repeat !== BaseVersion.RepeatType.OFF}
          size={Toggle.Size.SMALL}
          onChange={() =>
            patchSettings({ repeat: repeat === BaseVersion.RepeatType.OFF ? BaseVersion.RepeatType.DIALOG : BaseVersion.RepeatType.OFF })
          }
          hasLabel
        />
      </SettingsSubSection>
      {repeat !== BaseVersion.RepeatType.OFF && (
        <SettingsSubSection
          radioButton
          leftDescription={repeat === BaseVersion.RepeatType.DIALOG ? repeatDialog : repeatEverything}
          descriptionOffset={repeat === BaseVersion.RepeatType.DIALOG ? 0 : 42}
        >
          <Box width="318px" pb={24}>
            <RadioGroup
              options={REPEAT_OPTIONS}
              name="multiple"
              checked={repeat ?? BaseVersion.RepeatType.DIALOG}
              onChange={(repeat) => patchSettings({ repeat })}
              activeBar
              column
              noPaddingLastItem={false}
            />
          </Box>
        </SettingsSubSection>
      )}
    </>
  );
};

export default AssistantConversationLogic;
