import { Utils } from '@voiceflow/common';
import type { Entity, EntityWithVariants } from '@voiceflow/dtos';
import type * as Platform from '@voiceflow/platform-config';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SectionV2, useSetup } from '@voiceflow/ui';
import React from 'react';

import EntityPrompt from '@/components/EntityPrompt';
import * as GPT from '@/components/GPT';
import * as VersionV2 from '@/ducks/versionV2';
import { useAreIntentPromptsEmpty } from '@/hooks/intent.hook';
import { useMapManager } from '@/hooks/mapManager';
import { useActiveProjectTypeConfig } from '@/hooks/platformConfig';
import { useSelector } from '@/hooks/redux';
import { isDefaultSlotName } from '@/utils/slot';

interface EntityPromptSectionProps {
  title?: string;
  entity: Realtime.Slot | EntityWithVariants;
  prompts: unknown[];
  entities: Array<Realtime.Slot | Entity>;
  onChange: (prompts: unknown[]) => void;
  intentName: string;
  placeholder?: string;
  autogenerate?: boolean;
  intentInputs: Platform.Base.Models.Intent.Input[];
}

const EntityPromptSection: React.FC<EntityPromptSectionProps> = ({
  title = 'Entity reprompt',
  entity,
  prompts,
  onChange,
  entities,
  intentName,
  placeholder,
  autogenerate,
  intentInputs,
}) => {
  const projectConfig = useActiveProjectTypeConfig();

  const defaultVoice = useSelector(VersionV2.active.voice.defaultVoiceSelector);

  const intentInputsAreEmpty = useAreIntentPromptsEmpty(intentInputs);

  const promptsManager = useMapManager(prompts, onChange, {
    factory: () => projectConfig.utils.intent.promptFactory({ defaultVoice }),
  });

  const entityReprompt = GPT.useGPTGenFeatures();

  const gptGenEntityPrompt = GPT.useGenEntityPrompts({
    entity,
    examples: prompts,
    onAccept: (recommended) => onChange([...prompts, ...recommended]),
    intentName,
    intentInputs,
  });

  const genPromptsManager = useMapManager(gptGenEntityPrompt.items, gptGenEntityPrompt.onReplaceAll);

  const inputs = Utils.array.inferUnion('inputs' in entity ? entity.inputs : entity.variants);

  const entityInputsAreEmpty = React.useMemo(
    () =>
      inputs.every(
        ({ value, synonyms }) =>
          !value.trim() && !(Array.isArray(synonyms) ? synonyms : synonyms.split(',')).filter((s) => s.trim()).length
      ),
    [inputs]
  );

  const hasExtraContext =
    !isDefaultSlotName(entity.name) || !entityInputsAreEmpty || !!intentName || !intentInputsAreEmpty;

  useSetup(() => {
    if (autogenerate && (hasExtraContext || promptsManager.items)) {
      gptGenEntityPrompt.onGenerate({ quantity: 1 });
    }
  });

  return (
    <SectionV2.ActionCollapseSection
      title={<SectionV2.Title bold={entityReprompt.isEnabled || !!prompts.length}>{title}</SectionV2.Title>}
      action={<SectionV2.AddButton onClick={() => promptsManager.onAdd()} />}
      contentProps={{ bottomOffset: !entityReprompt.isEnabled && promptsManager.isEmpty ? 0 : 2.5 }}
    >
      {promptsManager.map((item, { key, isLast, onRemove, onUpdate }) => (
        <Box key={key} pb={isLast ? 0 : 16} width="100%">
          <SectionV2.ListItem action={<SectionV2.RemoveButton onClick={() => onRemove()} />}>
            <EntityPrompt
              slots={entities}
              prompt={item}
              onChange={onUpdate}
              autofocus={promptsManager.latestCreatedKey === key}
              placeholder={placeholder}
            />
          </SectionV2.ListItem>
        </Box>
      ))}

      {entityReprompt.isEnabled && (
        <Box pt={promptsManager.isEmpty ? 0 : 16}>
          {genPromptsManager.map((item, { key, index }) => (
            <Box key={key} pb={16}>
              <GPT.EntityPrompt
                index={promptsManager.size + index + 1}
                prompt={item}
                onFocus={() => gptGenEntityPrompt.onFocusItem(index)}
                isActive={index === gptGenEntityPrompt.activeIndex}
                onReject={() => gptGenEntityPrompt.onRejectItem(index)}
                onChange={(data) => gptGenEntityPrompt.onChangeItem(index, data)}
                entities={entities}
                activeIndex={gptGenEntityPrompt.activeIndex}
              />
            </Box>
          ))}

          <GPT.GenerateButton.EntityPrompt
            disabled={!!gptGenEntityPrompt.items.length || gptGenEntityPrompt.fetching}
            isLoading={gptGenEntityPrompt.fetching}
            onGenerate={({ quantity }) => gptGenEntityPrompt.onGenerate({ quantity })}
            contextPrompts={promptsManager.items}
            hasExtraContext={hasExtraContext}
          />
        </Box>
      )}
    </SectionV2.ActionCollapseSection>
  );
};

export default EntityPromptSection;
