import { Voice as AlexaVoice } from '@voiceflow/alexa-types';
import { Voice as GeneralVoice } from '@voiceflow/general-types';
import { Voice as GoogleVoice } from '@voiceflow/google-types';
import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import SSML from '@/components/SSML';
import Section, { SectionToggleVariant, SectionVariant } from '@/components/Section';
import Select from '@/components/Select';
import { ClickableText } from '@/components/Text';
import { toast } from '@/components/Toast';
import AudioUpload from '@/components/Upload/AudioUpload';
import { PlatformType } from '@/constants';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useDebouncedCallback, useDidUpdateEffect, useSyncedSmartReducerV2 } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { ErrorMessage } from '@/pages/Settings/components';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';
import { ConnectedProps } from '@/types';
import { getPlatformDefaultVoice, getPlatformValue } from '@/utils/platform';

import { REPEAT_OPTIONS, RESUME_PROMPT_MAX_LENGTH, SAVE_SETTINGS_DEBOUNCE_DELAY } from './constants';

const SSMLComponent: any = SSML;

type GlobalConversationLogicOwnProps = {
  platform: PlatformType;
  platformMeta: PlatformSettingsMetaProps;
};

const GlobalConversationLogic: React.FC<ConnectedGlobalConversationLogic & GlobalConversationLogicOwnProps> = ({
  meta,
  platform,
  platformMeta,
  saveSettings,
  updateSettings,
}) => {
  const { descriptors } = platformMeta;
  const { continuePrevious, allowRepeat, repeatDialog, repeatEverything } = descriptors;
  const { resumePrompt: resumePromptMeta, repeat: repeatMeta, restart: restartMeta, settings } = meta;

  const platformVoices = React.useMemo(() => {
    const voices = getPlatformValue<string[]>(platform, {
      [PlatformType.ALEXA]: Object.values(AlexaVoice),
      [PlatformType.GOOGLE]: Object.values(GoogleVoice),
      [PlatformType.GENERAL]: Object.values(GeneralVoice),
    });

    return voices.filter((voice) => voice !== 'audio');
  }, [platform]);

  const platformDefaultVoice = getPlatformDefaultVoice(platform);
  const defaultVoice = settings.defaultVoice || platformDefaultVoice;

  const defaultResumePrompt = React.useMemo(() => ({ content: '', follow_content: '', follow_voice: defaultVoice, voice: defaultVoice }), [
    defaultVoice,
  ]);

  const [state, actions] = useSyncedSmartReducerV2({
    repeat: repeatMeta || 0,
    restart: restartMeta,
    resumePrompt: resumePromptMeta || defaultResumePrompt,
    followUpType: resumePromptMeta?.follow_voice || defaultVoice,
    resumePromptType: resumePromptMeta?.voice || defaultVoice,
    previousSessionDialogError: false,
  });

  const onChangeResumePromptType = React.useCallback((resumePromptType: string) => {
    actions.resumePromptType.set(resumePromptType);
    actions.resumePrompt.update({ content: '', voice: resumePromptType });
  }, []);

  const onChangeFollowUpType = React.useCallback((followUpType: string) => {
    actions.followUpType.set(followUpType);
    actions.resumePrompt.update({ follow_content: '', follow_voice: followUpType });
  }, []);

  const onToggleHasFollowUp = React.useCallback(() => {
    if (!state.resumePrompt.follow_voice) {
      actions.resumePrompt.update({ follow_content: undefined, follow_voice: defaultVoice });
    } else {
      actions.resumePrompt.update({ follow_content: undefined, follow_voice: undefined });
    }
  }, [state.resumePrompt.follow_voice, defaultVoice]);

  const onChangeResumePromptContent = React.useCallback(
    ({ text }) => {
      if (text === state.resumePrompt.content) {
        return;
      }

      const valid = text.length <= RESUME_PROMPT_MAX_LENGTH;

      actions.update({
        resumePrompt: { ...state.resumePrompt, content: text },
        previousSessionDialogError: !valid,
      });
    },
    [state.resumePrompt.content]
  );

  const onChangeFollowUpVoice = React.useCallback((voice: string) => {
    actions.resumePrompt.update({ follow_voice: voice });
  }, []);

  const onChangeFollowUpContent = React.useCallback(
    ({ text }: { text: string }) => {
      if (text === state.resumePrompt.follow_content) {
        return;
      }

      actions.resumePrompt.update({ follow_content: text });
    },
    [state.resumePrompt.follow_content]
  );

  const onChangeResumePromptVoice = React.useCallback((voice: string) => {
    actions.resumePrompt.update({ voice });
  }, []);

  const onChangeDefaultVoice = React.useCallback((voice: string) => {
    updateSettings({ defaultVoice: voice });
  }, []);

  const saveSession = useDebouncedCallback(SAVE_SETTINGS_DEBOUNCE_DELAY, async (data) => {
    await saveSettings(data, ['session']);
  });

  useDidUpdateEffect(async () => {
    try {
      if (state.previousSessionDialogError) {
        throw new Error();
      }

      await saveSession({
        restart: state.restart,
        resumePrompt: state.resumePrompt,
      });
    } catch (err) {
      toast.error('Settings Save Error');
    }
  }, [state.restart, state.resumePrompt.voice, state.resumePrompt.content, state.resumePrompt.follow_voice, state.resumePrompt.follow_content]);

  useDidUpdateEffect(async () => {
    try {
      await saveSettings({ repeat: state.repeat }, ['repeat']);
    } catch (err) {
      toast.error('Settings Save Error');
    }
  }, [state.repeat]);

  useDidUpdateEffect(async () => {
    try {
      await saveSettings({ settings }, ['defaultVoice']);
    } catch (err) {
      toast.error('Settings Save Error');
    }
  }, [settings.defaultVoice]);

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
          <Select value={defaultVoice} options={platformVoices} onSelect={onChangeDefaultVoice} searchable placeholder={defaultVoice} />
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
        initialOpen={!state.restart}
        onToggleChange={actions.restart.set}
      >
        <FormControl>
          <FormControl>
            <RadioGroup
              options={[
                { id: defaultVoice, label: 'Speak', customCheckedCondition: (val) => val !== GeneralVoice.AUDIO },
                { id: GeneralVoice.AUDIO, label: 'Audio', customCheckedCondition: (val) => val === GeneralVoice.AUDIO },
              ]}
              name="multiple"
              checked={state.resumePromptType}
              onChange={onChangeResumePromptType}
            />
          </FormControl>

          {state.resumePromptType === GeneralVoice.AUDIO ? (
            <AudioUpload audio={state.resumePrompt.content} update={(value: string) => actions.resumePrompt.update({ content: value })} />
          ) : (
            <>
              <SSMLComponent
                voice={state.resumePrompt.voice || defaultVoice}
                value={state.resumePrompt.content || ''}
                onBlur={onChangeResumePromptContent}
                platform={platform}
                defaultVoice={defaultVoice}
                onChangeVoice={onChangeResumePromptVoice}
                platformDefaultVoice={platformDefaultVoice}
                onChangeDefaultVoice={onChangeDefaultVoice}
              />

              {state.previousSessionDialogError && <ErrorMessage>Confirmation message must not exceed 160 symbols.</ErrorMessage>}
            </>
          )}

          <ClickableText style={{ marginTop: '14px' }} onClick={onToggleHasFollowUp}>
            {state.resumePrompt.follow_voice ? 'Remove Follow Up' : 'Add Follow Up'}
          </ClickableText>
        </FormControl>

        {!!state.resumePrompt.follow_voice && (
          <Section isNested header="Resume Follow Up" isDividerNested variant={SectionVariant.QUATERNARY}>
            <FormControl>
              <RadioGroup
                options={[
                  { id: defaultVoice, label: 'Speak', customCheckedCondition: (val) => val !== GeneralVoice.AUDIO },
                  { id: GeneralVoice.AUDIO, label: 'Audio', customCheckedCondition: (val) => val === GeneralVoice.AUDIO },
                ]}
                name="multiple"
                checked={state.followUpType}
                onChange={onChangeFollowUpType}
              />
            </FormControl>

            {state.followUpType === GeneralVoice.AUDIO ? (
              <FormControl>
                <AudioUpload
                  audio={state.resumePrompt.follow_content}
                  update={(value: string) => actions.resumePrompt.update({ follow_content: value })}
                />
              </FormControl>
            ) : (
              <FormControl contentBottomUnits={3}>
                <SSMLComponent
                  voice={state.resumePrompt.follow_voice || defaultVoice}
                  value={state.resumePrompt.follow_content || ''}
                  onBlur={onChangeFollowUpContent}
                  platform={platform}
                  defaultVoice={defaultVoice}
                  onChangeVoice={onChangeFollowUpVoice}
                  platformDefaultVoice={platformDefaultVoice}
                  onChangeDefaultVoice={onChangeDefaultVoice}
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
        onToggleChange={(collapsed) => actions.repeat.set(collapsed ? 0 : 1)}
        headerToggle
        initialOpen={state.repeat >= 1}
      >
        <FormControl contentBottomUnits={3}>
          <RadioGroup options={REPEAT_OPTIONS} name="multiple" checked={state.repeat || 1} onChange={actions.repeat.set} />
          {state.repeat === 1 ? repeatDialog : repeatEverything}
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
  updateSettings: Skill.updateSettings,
};

type ConnectedGlobalConversationLogic = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(GlobalConversationLogic);
