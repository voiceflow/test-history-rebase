import { BaseVersion } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
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

  const patchSession = useDispatch(VersionDuck.patchSession);
  const patchSettings = useDispatch(VersionDuck.patchSettings);
  const updateDefaultVoice = useDispatch(VersionDuck.voice.updateDefaultVoice);

  const canUseAlexaSettings = useAlexaProjectSettings();

  const defaultResumePrompt = React.useMemo(
    () => ({ voice: defaultVoice, content: '', followVoice: defaultVoice, followContent: null }),
    [defaultVoice]
  );

  const resumePrompt = session?.resumePrompt ?? defaultResumePrompt;

  const { descriptors } = platformMeta;
  const { continuePrevious, allowRepeat, repeatDialog, repeatEverything } = descriptors;

  const onChangeResumePrompt = (value: Partial<Platform.Common.Voice.Models.Version.SessionResumePrompt<string>>) =>
    patchSession({ resumePrompt: { ...resumePrompt, ...value } });

  const onToggleFollowUp = () =>
    onChangeResumePrompt(resumePrompt?.followVoice ? { followContent: null, followVoice: null } : { followContent: null, followVoice: defaultVoice });

  return !canUseAlexaSettings ? null : (
    <>
      <Section
        header="Allow Users to Continue Previous Session"
        variant={SectionVariant.QUATERNARY}
        dividers
        initialOpen={!session?.restart}
        headerToggle
        contentPrefix={continuePrevious}
        onToggleChange={(nextRestart) => patchSession({ restart: nextRestart })}
        collapseVariant={SectionToggleVariant.TOGGLE}
        isDividerNested
      >
        <FormControl>
          <FormControl>
            <RadioGroup
              options={[
                { id: false, label: 'Speak' },
                { id: true, label: 'Audio' },
              ]}
              name="multiple"
              checked={resumePrompt.voice === VoiceflowConstants.Voice.AUDIO}
              onChange={(checked) => onChangeResumePrompt({ content: '', voice: checked ? VoiceflowConstants.Voice.AUDIO : defaultVoice })}
            />
          </FormControl>

          {resumePrompt.voice === VoiceflowConstants.Voice.AUDIO ? (
            <Upload.AudioUpload
              audio={resumePrompt.content}
              update={(src) => onChangeResumePrompt({ content: src ?? '' })}
              className={CONTEXT_MENU_IGNORED_CLASS_NAME}
              renderInput={VariablesInput.renderInput}
            />
          ) : (
            <>
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

              {resumePrompt.content.length <= RESUME_PROMPT_MAX_LENGTH && (
                <ErrorMessage>Confirmation message must not exceed 160 symbols.</ErrorMessage>
              )}
            </>
          )}

          <ClickableText style={{ marginTop: '14px' }} onClick={onToggleFollowUp}>
            {resumePrompt.followVoice ? 'Remove Follow Up' : 'Add Follow Up'}
          </ClickableText>
        </FormControl>

        {!!resumePrompt.followVoice && (
          <Section isNested header="Resume Follow Up" isDividerNested variant={SectionVariant.QUATERNARY}>
            <FormControl>
              <RadioGroup
                options={[
                  { id: false, label: 'Speak' },
                  { id: true, label: 'Audio' },
                ]}
                name="multiple"
                checked={resumePrompt.followVoice === VoiceflowConstants.Voice.AUDIO}
                onChange={(checked) =>
                  onChangeResumePrompt({ followContent: '', followVoice: checked ? VoiceflowConstants.Voice.AUDIO : defaultVoice })
                }
              />
            </FormControl>

            {resumePrompt.followVoice === VoiceflowConstants.Voice.AUDIO ? (
              <FormControl>
                <Upload.AudioUpload
                  audio={resumePrompt.followContent}
                  update={(src) => onChangeResumePrompt({ followContent: src })}
                  className={CONTEXT_MENU_IGNORED_CLASS_NAME}
                  renderInput={VariablesInput.renderInput}
                />
              </FormControl>
            ) : (
              <FormControl contentBottomUnits={3}>
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
              </FormControl>
            )}
          </Section>
        )}
      </Section>

      <Section
        header="Allow Users to Repeat"
        variant={SectionVariant.QUATERNARY}
        initialOpen={!!settings && settings.repeat !== BaseVersion.RepeatType.OFF}
        headerToggle
        contentPrefix={allowRepeat}
        onToggleChange={(collapsed) => patchSettings({ repeat: collapsed ? BaseVersion.RepeatType.OFF : BaseVersion.RepeatType.DIALOG })}
        collapseVariant={SectionToggleVariant.TOGGLE}
        isDividerNested
      >
        <FormControl contentBottomUnits={3}>
          <RadioGroup
            name="multiple"
            options={REPEAT_OPTIONS}
            checked={settings?.repeat ?? BaseVersion.RepeatType.DIALOG}
            onChange={(repeat) => patchSettings({ repeat })}
          />

          {settings?.repeat === BaseVersion.RepeatType.DIALOG ? repeatDialog : repeatEverything}
        </FormControl>
      </Section>
    </>
  );
};

export default AssistantConversationLogic;
