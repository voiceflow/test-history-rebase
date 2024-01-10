import composeRef from '@seznam/compose-react-refs';
import { BaseModels, BaseUtils } from '@voiceflow/base-types';
import { Box, Divider, Popper, SquareButton } from '@voiceflow/ui-next';
import React from 'react';

import { SYSTEM_PROMPT_AI_MODELS } from '@/config/ai-model';
import { stopPropagation } from '@/utils/handler.util';

import { KBSettingsInstructions } from '../KnowledgeBaseSettings/KBSettingsInstructions.component';
import { KBSettingsModelSelect } from '../KnowledgeBaseSettings/KBSettingsModelSelect.component';
import { KBSettingsSystemPrompt } from '../KnowledgeBaseSettings/KBSettingsSystemPrompt.component';
import { KBSettingsTemperature } from '../KnowledgeBaseSettings/KBSettingsTemperature.component';
import { KBSettingsTokens } from '../KnowledgeBaseSettings/KBSettingsTokens.component';
import { DEFAULT_SETTINGS } from '../KnowledgeBaseSettings/KnowledgeBaseSettings.constant';
import { popperStyles, textareaStyles } from './KBPreviewSettings.css';

interface AIModelParams extends BaseUtils.ai.AIModelParams {
  [key: string]: any;
}

interface AIContextParams extends BaseUtils.ai.AIKnowledgeContextParams {
  [key: string]: any;
}

type KnowledgeBaseSettings = BaseModels.Project.KnowledgeBaseSettings & {
  [key: string]: any;
  summarization: AIModelParams & AIContextParams;
};

export interface IPreviewSettings {
  initialSettings: KnowledgeBaseSettings;
  settings: BaseModels.Project.KnowledgeBaseSettings;
  isOpen: boolean;
  setSettings: React.Dispatch<React.SetStateAction<BaseModels.Project.KnowledgeBaseSettings>>;
  onToggle: () => void;
}

export const KBPreviewSettings: React.FC<IPreviewSettings> = ({ initialSettings, settings, isOpen, setSettings, onToggle: handleToggle }) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [activeTooltipLabel, setTooltipActiveLabel] = React.useState<string | null>(null);

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
    onPatch('summarization', { instruction: initialSettings.summarization.instruction });
  };

  return (
    <Popper
      placement="right"
      referenceElement={({ ref, popper, onToggle }) => (
        <SquareButton ref={composeRef(ref, buttonRef)} onClick={onToggle} isActive={isOpen} iconName={isOpen ? 'Minus' : 'Settings'}>
          {popper}
        </SquareButton>
      )}
      isOpen={isOpen}
      onPreventClose={(event) => {
        if (!buttonRef.current) return true;
        if (!event?.target) return true;
        return !buttonRef.current.contains(event.target as Node);
      }}
      onOpen={handleToggle}
      onClose={handleToggle}
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
          <Box direction="column" pr={24} pb={24}>
            <KBSettingsModelSelect
              value={settings?.summarization.model ?? DEFAULT_SETTINGS.summarization.model}
              disabled={!settings}
              onValueChange={(model) => onPatch('summarization', { model: model as any })}
              activeTooltipLabel={activeTooltipLabel}
              setTooltipActiveLabel={setTooltipActiveLabel}
            />
            <KBSettingsTemperature
              value={settings?.summarization.temperature ?? DEFAULT_SETTINGS.summarization.temperature}
              disabled={!settings}
              onValueChange={(temperature) => onPatch('summarization', { temperature })}
              activeTooltipLabel={activeTooltipLabel}
              setTooltipActiveLabel={setTooltipActiveLabel}
            />
            <KBSettingsTokens
              value={settings?.summarization.maxTokens ?? DEFAULT_SETTINGS.summarization.maxTokens}
              disabled={!settings}
              onValueChange={(maxTokens) => onPatch('summarization', { maxTokens })}
              activeTooltipLabel={activeTooltipLabel}
              setTooltipActiveLabel={setTooltipActiveLabel}
            />
            <KBSettingsInstructions
              className={textareaStyles}
              value={settings?.summarization.instruction ?? DEFAULT_SETTINGS.summarization.instruction}
              onValueChange={(instruction: string) => onPatch('summarization', { instruction })}
              activeTooltipLabel={activeTooltipLabel}
              setTooltipActiveLabel={setTooltipActiveLabel}
            />
            {SYSTEM_PROMPT_AI_MODELS.has(settings?.summarization.model ?? DEFAULT_SETTINGS.summarization.model) && (
              <KBSettingsSystemPrompt
                value={settings?.summarization.system ?? DEFAULT_SETTINGS.summarization.system}
                disabled={!settings}
                onValueChange={(system) => onPatch('summarization', { system })}
                className={textareaStyles}
                activeTooltipLabel={activeTooltipLabel}
                setTooltipActiveLabel={setTooltipActiveLabel}
              />
            )}
          </Box>
        </Box>
      )}
    </Popper>
  );
};
