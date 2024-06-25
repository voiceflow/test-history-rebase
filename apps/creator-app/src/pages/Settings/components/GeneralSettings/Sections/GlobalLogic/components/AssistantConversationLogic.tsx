import { BaseVersion } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import { Box, ClickableText, CONTEXT_MENU_IGNORED_CLASS_NAME, SectionV2, Toggle } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import Upload from '@/components/legacy/Upload';
import RadioGroup from '@/components/RadioGroup';
import * as Settings from '@/components/Settings';
import SSML from '@/components/SSML';
import VariablesInput from '@/components/VariablesInput';
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

const AssistantConversationLogic: React.FC<AssistantConversationLogicProps> = ({
  platform,
  projectType,
  platformMeta,
  defaultVoice,
  platformDefaultVoice,
}) => {
  const session = useSelector(VersionV2.active.voice.sessionSelector);
  const settings = useSelector(VersionV2.active.voice.settingsSelector);

  const patchSession = useDispatch(VersionV2.patchSession);
  const patchSettings = useDispatch(VersionV2.patchSettings);
  const updateDefaultVoice = useDispatch(VersionV2.voice.updateDefaultVoice);

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
    onChangeResumePrompt(
      resumePrompt?.followVoice
        ? { followContent: null, followVoice: null }
        : { followContent: null, followVoice: defaultVoice }
    );

  return !canUseAlexaSettings ? null : (
    <>
      <SectionV2.Divider />

      <Settings.SubSection header="Allow Users to Continue Previous Session">
        <Box.FlexAround gap={24}>
          {continuePrevious}

          <Toggle
            checked={restart}
            size={Toggle.Size.SMALL}
            onChange={() => patchSession({ restart: !restart })}
            hasLabel
          />
        </Box.FlexAround>
      </Settings.SubSection>

      {restart && (
        <>
          <Settings.SubSection splitView>
            <Settings.SubSection.RadioGroupContainer>
              <RadioGroup
                width="318px"
                column
                options={[
                  { id: false, label: 'Speak' },
                  { id: true, label: 'Audio' },
                ]}
                name="multiple"
                checked={resumePrompt.voice === VoiceflowConstants.Voice.AUDIO}
                onChange={(checked) =>
                  onChangeResumePrompt({ content: '', voice: checked ? VoiceflowConstants.Voice.AUDIO : defaultVoice })
                }
                activeBar
                noPaddingLastItem={false}
              />
            </Settings.SubSection.RadioGroupContainer>

            <div />
          </Settings.SubSection>

          {resumePrompt.voice === VoiceflowConstants.Voice.AUDIO ? (
            <Settings.SubSection>
              <Upload.AudioUpload
                audio={resumePrompt.content}
                update={(src) => onChangeResumePrompt({ content: src ?? '' })}
                className={CONTEXT_MENU_IGNORED_CLASS_NAME}
                renderInput={VariablesInput.renderInput}
              />
            </Settings.SubSection>
          ) : (
            <Settings.SubSection>
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
            </Settings.SubSection>
          )}

          <Settings.SubSection contentProps={{ topOffset: 1.5 }}>
            <ClickableText onClick={onToggleFollowUp}>
              {resumePrompt.followVoice ? 'Remove Follow Up' : 'Add Follow Up'}
            </ClickableText>
          </Settings.SubSection>

          {!!resumePrompt.followVoice && (
            <>
              <SectionV2.Divider inset />

              <Settings.SubSection header="Resume Follow Up" contentProps={{ topOffset: 0 }} splitView>
                <Settings.SubSection.RadioGroupContainer>
                  <RadioGroup
                    name="multiple"
                    width="318px"
                    column
                    options={[
                      { id: false, label: 'Speak' },
                      { id: true, label: 'Audio' },
                    ]}
                    checked={resumePrompt.followVoice === VoiceflowConstants.Voice.AUDIO}
                    onChange={(checked) =>
                      onChangeResumePrompt({
                        followContent: '',
                        followVoice: checked ? VoiceflowConstants.Voice.AUDIO : defaultVoice,
                      })
                    }
                    activeBar
                    noPaddingLastItem={false}
                  />
                </Settings.SubSection.RadioGroupContainer>

                <div />
              </Settings.SubSection>

              {resumePrompt.followVoice === VoiceflowConstants.Voice.AUDIO ? (
                <Settings.SubSection>
                  <Upload.AudioUpload
                    renderInput={VariablesInput.renderInput}
                    audio={resumePrompt.followContent}
                    update={(src) => onChangeResumePrompt({ followContent: src })}
                    className={CONTEXT_MENU_IGNORED_CLASS_NAME}
                  />
                </Settings.SubSection>
              ) : (
                <Settings.SubSection>
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
                </Settings.SubSection>
              )}
            </>
          )}
        </>
      )}

      <SectionV2.Divider />

      <Settings.SubSection header="Allow Users to Repeat">
        <Box.FlexAround gap={24}>
          {allowRepeat}

          <Toggle
            size={Toggle.Size.SMALL}
            checked={repeat !== BaseVersion.RepeatType.OFF}
            onChange={() =>
              patchSettings({
                repeat:
                  repeat === BaseVersion.RepeatType.OFF ? BaseVersion.RepeatType.DIALOG : BaseVersion.RepeatType.OFF,
              })
            }
            hasLabel
          />
        </Box.FlexAround>
      </Settings.SubSection>

      {repeat !== BaseVersion.RepeatType.OFF && (
        <Settings.SubSection splitView>
          <Settings.SubSection.RadioGroupContainer>
            <RadioGroup
              name="multiple"
              width="318px"
              column
              options={REPEAT_OPTIONS}
              checked={repeat || BaseVersion.RepeatType.DIALOG}
              onChange={(repeat) => patchSettings({ repeat })}
              activeBar
              noPaddingLastItem={false}
            />
          </Settings.SubSection.RadioGroupContainer>

          <Settings.SubSection.RadioGroupDescription offset={repeat === BaseVersion.RepeatType.ALL}>
            {repeat === BaseVersion.RepeatType.DIALOG ? repeatDialog : repeatEverything}
          </Settings.SubSection.RadioGroupDescription>
        </Settings.SubSection>
      )}
    </>
  );
};

export default AssistantConversationLogic;
