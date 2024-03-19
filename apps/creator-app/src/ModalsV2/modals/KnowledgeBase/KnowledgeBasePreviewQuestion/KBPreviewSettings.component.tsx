import composeRef from '@seznam/compose-react-refs';
import { BaseModels, BaseUtils } from '@voiceflow/base-types';
import { tid } from '@voiceflow/style';
import { BaseProps, Box, Divider, Popper, Scroll, SquareButton, Surface, usePopperModifiers } from '@voiceflow/ui-next';
import React, { useMemo, useRef } from 'react';

import { AIMaxTokensSliderSection } from '@/components/AI/AIMaxTokensSliderSection/AIMaxTokensSliderSection.component';
import { AIModelSelectSection } from '@/components/AI/AIModelSelectSection/AIModelSelectSection.component';
import { AITemperatureSliderSection } from '@/components/AI/AITemperatureSliderSection/AITemperatureSlider.component';
import { KBInstructionInputSection } from '@/components/KB/KBInstructionInputSection/KBInstructionInputSection.component';
import { KBSystemInputSection } from '@/components/KB/KBSystemInputSection/KBSystemInputSection.component';
import { AI_MODEL_CONFIG_MAP } from '@/config/ai-model';
import { CMS_KNOWLEDGE_BASE_LEARN_MORE } from '@/constants/link.constant';
import { stopPropagation } from '@/utils/handler.util';

import { SETTINGS_TEST_ID } from '../KnowledgeBase.constant';
import { DEFAULT_SETTINGS } from '../KnowledgeBaseSettings/KnowledgeBaseSettings.constant';
import { stickyDividerContainer } from './KnowledgeBasePreviewQuestion.css';

type SummarizationSettings = BaseModels.Project.KnowledgeBaseSettings['summarization'];

export interface IPreviewSettings extends BaseProps {
  settings: SummarizationSettings;
  initialSettings: SummarizationSettings;
  onChangeSettings: (value: SummarizationSettings) => void;
}

export const KBPreviewSettings: React.FC<IPreviewSettings> = ({ testID, settings, initialSettings, onChangeSettings }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modifiers = usePopperModifiers([
    { name: 'preventOverflow', options: { boundary: globalThis.document?.body, padding: 32 } },
    { name: 'offset', options: { offset: [-20, 57] } },
  ]);

  const differences = useMemo(
    () => Object.entries(settings).filter(([k, v]) => initialSettings[k as keyof SummarizationSettings] !== v).length,
    [settings, initialSettings]
  );

  const onPatch = (value: Partial<SummarizationSettings>) => onChangeSettings({ ...settings, ...value });

  const model = settings.model ?? DEFAULT_SETTINGS.summarization.model;

  return (
    <Popper
      testID={tid(testID, 'menu')}
      modifiers={modifiers}
      placement="right"
      referenceElement={({ ref, popper, onToggle, isOpen }) => (
        <SquareButton ref={composeRef(ref, buttonRef)} onClick={onToggle} isActive={isOpen} iconName={isOpen ? 'Minus' : 'Settings'} testID={testID}>
          {popper}
        </SquareButton>
      )}
      onPreventClose={(event) => {
        if (!event) return false;
        if (!buttonRef.current || !event.target) return true;
        return !buttonRef.current.contains(event.target as Node);
      }}
    >
      {() => (
        <Surface width="300px" direction="column" maxHeight="calc(100vh - 64px)" overflow="hidden">
          <Scroll pb={24} style={{ display: 'block' }}>
            <Box pt={16} pl={24} className={stickyDividerContainer}>
              <Divider
                label={differences > 0 ? `Reset ${differences} overrides` : 'Overrides'}
                onLabelClick={differences > 0 ? stopPropagation(() => onChangeSettings(initialSettings)) : undefined}
              />
            </Box>

            <Box direction="column" gap={12}>
              <AIModelSelectSection
                value={model}
                testID={tid(SETTINGS_TEST_ID, 'model')}
                learnMoreURL={CMS_KNOWLEDGE_BASE_LEARN_MORE}
                onValueChange={(model) => onPatch({ model: model as BaseUtils.ai.GPT_MODEL })}
              />

              <AITemperatureSliderSection
                value={settings.temperature ?? DEFAULT_SETTINGS.summarization.temperature}
                testID={tid(SETTINGS_TEST_ID, 'temperature')}
                learnMoreURL={CMS_KNOWLEDGE_BASE_LEARN_MORE}
                onValueChange={(temperature) => onPatch({ temperature })}
              />

              <AIMaxTokensSliderSection
                model={model}
                value={settings.maxTokens ?? DEFAULT_SETTINGS.summarization.maxTokens}
                testID={tid(SETTINGS_TEST_ID, 'tokens')}
                learnMoreURL={CMS_KNOWLEDGE_BASE_LEARN_MORE}
                onValueChange={(maxTokens) => onPatch({ maxTokens })}
              />

              <KBInstructionInputSection
                value={settings.instruction ?? DEFAULT_SETTINGS.summarization.instruction}
                testID={tid(SETTINGS_TEST_ID, 'instructions')}
                learnMoreURL={CMS_KNOWLEDGE_BASE_LEARN_MORE}
                onValueChange={(instruction) => onPatch({ instruction })}
              />

              {AI_MODEL_CONFIG_MAP[model].hasSystemPrompt && (
                <KBSystemInputSection
                  value={settings.system ?? DEFAULT_SETTINGS.summarization.system}
                  testID={tid(SETTINGS_TEST_ID, 'system-prompt')}
                  learnMoreURL={CMS_KNOWLEDGE_BASE_LEARN_MORE}
                  onValueChange={(system) => onPatch({ system })}
                />
              )}
            </Box>
          </Scroll>
        </Surface>
      )}
    </Popper>
  );
};
