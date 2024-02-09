import composeRef from '@seznam/compose-react-refs';
import { BaseModels, BaseUtils } from '@voiceflow/base-types';
import { tid } from '@voiceflow/style';
import { BaseProps, Box, Divider, Popper, SquareButton } from '@voiceflow/ui-next';
import React, { useEffect } from 'react';

import { SYSTEM_PROMPT_AI_MODELS } from '@/config/ai-model';
import { stopPropagation } from '@/utils/handler.util';

import { KBSettingsInstructions } from '../KnowledgeBaseSettings/KBSettingsInstructions.component';
import { KBSettingsModelSelect } from '../KnowledgeBaseSettings/KBSettingsModelSelect.component';
import { KBSettingsSystemPrompt } from '../KnowledgeBaseSettings/KBSettingsSystemPrompt.component';
import { KBSettingsTemperature } from '../KnowledgeBaseSettings/KBSettingsTemperature.component';
import { KBSettingsTokens } from '../KnowledgeBaseSettings/KBSettingsTokens.component';
import { DEFAULT_SETTINGS } from '../KnowledgeBaseSettings/KnowledgeBaseSettings.constant';
import { MODAL_DEFAULT_HEIGHT, MODAL_PADDING, NUMBER_OF_TEXT_AREAS, TEXT_AREA_NEW_LINE_HEIGHT } from './KBPreviewSettings.constants';
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

export interface IPreviewSettings extends BaseProps {
  initialSettings: KnowledgeBaseSettings;
  settings: BaseModels.Project.KnowledgeBaseSettings;
  isOpen: boolean;
  setSettings: React.Dispatch<React.SetStateAction<BaseModels.Project.KnowledgeBaseSettings>>;
  onToggle: () => void;
}

export const KBPreviewSettings: React.FC<IPreviewSettings> = ({ initialSettings, settings, isOpen, setSettings, onToggle: handleToggle, testID }) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [activeTooltipLabel, setTooltipActiveLabel] = React.useState<string | null>(null);

  const [instructionsMaxRows, setInstructionsMaxRows] = React.useState<number>(12);
  const [instructionText, setInstructionText] = React.useState<string>(initialSettings.summarization.instructions ?? '');

  const [systemMaxRows, setSystemMaxRows] = React.useState<number>(12);
  const [systemText, setSystemText] = React.useState<string>(initialSettings.summarization.system ?? '');

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

  const model = settings?.summarization.model ?? DEFAULT_SETTINGS.summarization.model;

  const getModal = () => {
    const viewportHeight = window.innerHeight;
    const modal = document.querySelector(`.${popperStyles}`);
    return { viewportHeight, modal };
  };

  const calculateMaxRows = () => {
    const { viewportHeight, modal } = getModal();

    if (!modal) return null;

    return Math.round((viewportHeight - MODAL_PADDING - MODAL_DEFAULT_HEIGHT) / TEXT_AREA_NEW_LINE_HEIGHT / NUMBER_OF_TEXT_AREAS);
  };

  const calculateInstructionsMaxRows = () => {
    const maxRows = calculateMaxRows();
    if (!maxRows) return;
    setInstructionsMaxRows(maxRows);
  };

  const calculateSystemMaxRows = () => {
    const { viewportHeight, modal } = getModal();
    let maxRows = calculateMaxRows();
    if (!maxRows || !modal) return;

    const fromBottom = Math.abs(viewportHeight - modal.getBoundingClientRect().bottom);

    if (fromBottom > MODAL_PADDING) {
      maxRows += 1;
    }

    setSystemMaxRows(maxRows);
  };

  useEffect(() => {
    calculateInstructionsMaxRows();
    window.addEventListener('resize', calculateInstructionsMaxRows);
    return () => {
      window.removeEventListener('resize', calculateInstructionsMaxRows);
    };
  }, [instructionText]);

  useEffect(() => {
    calculateSystemMaxRows();
    window.addEventListener('resize', calculateSystemMaxRows);
    return () => {
      window.removeEventListener('resize', calculateSystemMaxRows);
    };
  }, [systemText]);

  useEffect(() => {
    setInstructionText(initialSettings.summarization.instructions ?? '');
    setSystemText(initialSettings.summarization.system ?? '');
  }, [initialSettings.summarization.instructions, initialSettings.summarization.system]);

  return (
    <Popper
      placement="right"
      referenceElement={({ ref, popper, onToggle }) => (
        <SquareButton ref={composeRef(ref, buttonRef)} onClick={onToggle} isActive={isOpen} iconName={isOpen ? 'Minus' : 'Settings'} testID={testID}>
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
      testID={tid(testID, 'menu')}
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
              value={model}
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
              model={model}
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
              maxRows={instructionsMaxRows}
              onValueType={setInstructionText}
            />

            {SYSTEM_PROMPT_AI_MODELS.has(model) && (
              <KBSettingsSystemPrompt
                value={settings?.summarization.system ?? DEFAULT_SETTINGS.summarization.system}
                disabled={!settings}
                onValueChange={(system) => onPatch('summarization', { system })}
                className={textareaStyles}
                activeTooltipLabel={activeTooltipLabel}
                setTooltipActiveLabel={setTooltipActiveLabel}
                maxRows={systemMaxRows}
                onValueType={setSystemText}
              />
            )}
          </Box>
        </Box>
      )}
    </Popper>
  );
};
