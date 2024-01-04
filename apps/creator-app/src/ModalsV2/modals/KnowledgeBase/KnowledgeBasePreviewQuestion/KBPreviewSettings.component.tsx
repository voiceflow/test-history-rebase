import { BaseModels, BaseUtils } from '@voiceflow/base-types';
import { Box, Divider, Popper, SquareButton } from '@voiceflow/ui-next';
import React from 'react';

import { SYSTEM_PROMPT_AI_MODELS } from '@/config/ai-model';
import { stopPropagation } from '@/utils/handler.util';

// import { KBSettingsInstructions } from '@/ModalsV2/modals/KnowledgeBase/KnowledgeBaseSettings/KBSettingsInstructions.component';
import { KBSettingsModelSelect } from '../KnowledgeBaseSettings/KBSettingsModelSelect.component';
import { KBSettingsSystemPrompt } from '../KnowledgeBaseSettings/KBSettingsSystemPrompt.component';
import { KBSettingsTemperature } from '../KnowledgeBaseSettings/KBSettingsTemperature.component';
import { KBSettingsTokens } from '../KnowledgeBaseSettings/KBSettingsTokens.component';
import { DEFAULT_SETTINGS } from '../KnowledgeBaseSettings/KnowledgeBaseSettings.constant';
import { popperStyles, textareaStyles } from './KBPreviewSettings.css';

interface AIModelParams extends BaseUtils.ai.AIModelParams {
  [key: string]: any;
}

interface AIContextParams extends BaseUtils.ai.AIContextParams {
  [key: string]: any;
}

type KnowledgeBaseSettings = BaseModels.Project.KnowledgeBaseSettings & {
  [key: string]: any;
  summarization: AIModelParams & AIContextParams;
};

export interface IPreviewSettings {
  initialSettings: KnowledgeBaseSettings;
  settings: BaseModels.Project.KnowledgeBaseSettings;
  setSettings: React.Dispatch<React.SetStateAction<BaseModels.Project.KnowledgeBaseSettings>>;
}

export const KBPreviewSettings: React.FC<IPreviewSettings> = ({ initialSettings, settings, setSettings }) => {
  const onPatch = <K extends keyof BaseModels.Project.KnowledgeBaseSettings>(key: K, patch: Partial<BaseModels.Project.KnowledgeBaseSettings[K]>) => {
    setSettings((prev) => prev && { ...prev, [key]: { ...prev[key], ...patch } });
  };

  const differences = React.useMemo(() => {
    const summDiffs = Object.fromEntries(Object.entries(settings?.summarization).filter(([k, v]) => initialSettings?.summarization[k] !== v));
    return Object.keys(summDiffs).length;
  }, [settings]);

  const resetSettings = () => {
    onPatch('summarization', { model: initialSettings.summarization.model });
    onPatch('summarization', { temperature: initialSettings.summarization.temperature });
    onPatch('summarization', { maxTokens: initialSettings.summarization.maxTokens });
    onPatch('summarization', { system: initialSettings.summarization.system });
    // onPatch('summarization', { instructions: initialSettings.summarization.instructions });
  };
  return (
    <Popper
      placement="right"
      referenceElement={({ onToggle, isOpen, ref, popper }) => (
        <SquareButton ref={ref} onClick={onToggle} isActive={isOpen} iconName={isOpen ? 'Minus' : 'Settings'}>
          {popper}
        </SquareButton>
      )}
      className={popperStyles}
      modifiers={[
        { name: 'preventOverflow', options: { boundary: globalThis.document?.body, padding: 32 } },
        { name: 'offset', options: { offset: [-20, 57] } },
      ]}
    >
      {() => (
        <Box width="300px" direction="column">
          <Box pt={16} pl={24}>
            <Divider
              label={differences > 0 ? `Reset ${differences} overrides` : 'Overrides'}
              onLabelClick={differences > 0 ? stopPropagation(resetSettings) : undefined}
            />
          </Box>
          <Box direction="column" px={24} pb={24}>
            <KBSettingsModelSelect
              value={settings?.summarization.model ?? DEFAULT_SETTINGS.summarization.model}
              disabled={!settings}
              onValueChange={(model) => onPatch('summarization', { model: model as any })}
            />
            <KBSettingsTemperature
              value={settings?.summarization.temperature ?? DEFAULT_SETTINGS.summarization.temperature}
              disabled={!settings}
              onValueChange={(temperature) => onPatch('summarization', { temperature })}
            />
            <KBSettingsTokens
              value={settings?.summarization.maxTokens ?? DEFAULT_SETTINGS.summarization.maxTokens}
              disabled={!settings}
              onValueChange={(maxTokens) => onPatch('summarization', { maxTokens })}
            />
            {/* <KBSettingsInstructions */}
            {/*  className={textareaStyles} */}
            {/*  value={settings?.summarization.instructions ?? DEFAULT_SETTINGS.summarization.instructions} */}
            {/*  onValueChange={(instructions) => onPatch('summarization', { instructions })} */}
            {/* /> */}
            {SYSTEM_PROMPT_AI_MODELS.has(settings?.summarization.model ?? DEFAULT_SETTINGS.summarization.model) && (
              <KBSettingsSystemPrompt
                value={settings?.summarization.system ?? DEFAULT_SETTINGS.summarization.system}
                disabled={!settings}
                onValueChange={(system) => onPatch('summarization', { system })}
                className={textareaStyles}
              />
            )}
          </Box>
        </Box>
      )}
    </Popper>
  );
};
