import { READABLE_VARIABLE_REGEXP, Utils } from '@voiceflow/common';
import { Entity } from '@voiceflow/dtos';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { serializeToText } from '@voiceflow/slate-serializer/text';
import { useTeardown } from '@voiceflow/ui';

import { mlGatewayClient } from '@/client/ml-gateway';
import * as SlateEditor from '@/components/SlateEditable/editor';
import * as Designer from '@/ducks/designer';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as VersionV2 from '@/ducks/versionV2';
import { useActiveProjectType, useSelector } from '@/hooks';
import { slotToString, transformVariablesToReadable } from '@/utils/slot';

import { GenApi, useGen } from './gen';

export const useGenVoiceEntityPrompts = ({
  entity,
  examples,
  onAccept,
  disabled,
  intentName,
  intentInputs,
}: {
  entity: Realtime.Slot | Entity;
  examples: Platform.Common.Voice.Models.Intent.Prompt[];
  onAccept: (items: Platform.Common.Voice.Models.Intent.Prompt[]) => void;
  disabled?: boolean;
  intentName: string;
  intentInputs: Platform.Base.Models.Intent.Input[];
}): GenApi<Platform.Common.Voice.Models.Intent.Prompt> => {
  const variables = useSelector(DiagramV2.active.allSlotsAndVariablesNormalizedSelector);
  const slotNameMap = useSelector(Designer.Entity.selectors.mapByName);
  const defaultVoice = useSelector(VersionV2.active.voice.defaultVoiceSelector);

  const api = useGen<Platform.Common.Voice.Models.Intent.Prompt>({
    onAccept,
    disabled,
    examples,

    examplesToDB: (items) => items.map((item) => transformVariablesToReadable(item.text, variables.byKey)).filter(Boolean),

    dbExamplesToTrack: (items) => items,

    generate: async (options) => {
      const exampleVoice = examples.find((item) => item.voice)?.voice;

      const { results } = await mlGatewayClient.generation.generateEntityReprompt({
        ...options,
        type: ('type' in entity ? entity.type : entity.classifier) ?? Realtime.CUSTOM_SLOT_TYPE,
        name: entity.name,
        intentName,
        intentInputs: intentInputs.map((input) => transformVariablesToReadable(input.text, variables.byKey)).filter(Boolean),
      });

      return results.map((result) => {
        const slots: string[] = [];

        const text = result.replace(READABLE_VARIABLE_REGEXP, (_, name) => {
          const slot = slotNameMap[name];

          if (slot) slots.push(slot.id);

          return slotToString(slot ?? { id: name, name });
        });

        return { text, slots, voice: exampleVoice ?? defaultVoice };
      });
    },
  });

  useTeardown(() => api.onAcceptAll());

  return api;
};

export const useGenChatEntityPrompts = ({
  entity,
  examples,
  onAccept,
  disabled,
  intentName,
  intentInputs,
}: {
  entity: Realtime.Slot | Entity;
  examples: Platform.Common.Chat.Models.Prompt.Model[];
  onAccept: (items: Platform.Common.Chat.Models.Prompt.Model[]) => void;
  disabled?: boolean;
  intentName: string;
  intentInputs: Platform.Base.Models.Intent.Input[];
}): GenApi<Platform.Common.Chat.Models.Prompt.Model> => {
  const variables = useSelector(DiagramV2.active.allSlotsAndVariablesNormalizedSelector);

  const api = useGen<Platform.Common.Chat.Models.Prompt.Model>({
    onAccept,
    disabled,
    examples,

    examplesToDB: (items) => items.map((item) => serializeToText(item.content, { variablesMap: variables.byKey })).filter(Boolean),

    dbExamplesToTrack: (items) => items,

    generate: async (options) => {
      const { results } = await mlGatewayClient.generation.generateEntityReprompt({
        ...options,
        type: ('type' in entity ? entity.type : entity.classifier) ?? Realtime.CUSTOM_SLOT_TYPE,
        name: entity.name,
        intentName,
        intentInputs: intentInputs.map((input) => transformVariablesToReadable(input.text, variables.byKey)).filter(Boolean),
      });

      const editor = SlateEditor.createEditor([SlateEditor.PluginType.VARIABLES]);

      editor.pluginsOptions = { [SlateEditor.PluginType.VARIABLES]: { variables } };

      return results.map((result) => ({
        id: Utils.id.cuid.slug(),
        content: [{ children: editor.processText({ originalText: result }) }],
      }));
    },
  });

  useTeardown(() => api.onAcceptAll());

  return api;
};

export const useGenEntityPrompts = ({
  entity,
  examples,
  onAccept,
  disabled,
  intentName,
  intentInputs,
}: {
  entity: Realtime.Slot | Entity;
  examples: unknown[];
  onAccept: (items: unknown[]) => void;
  disabled?: boolean;
  intentName: string;
  intentInputs: Platform.Base.Models.Intent.Input[];
}): GenApi<unknown> => {
  const projectType = useActiveProjectType();

  const isChat = Platform.Common.Chat.CONFIG.is(projectType);

  const gptGenChat = useGenChatEntityPrompts({
    entity,
    disabled: disabled || !isChat,
    examples: examples as Platform.Common.Chat.Models.Prompt.Model[],
    onAccept,
    intentName,
    intentInputs,
  });
  const gptGenVoice = useGenVoiceEntityPrompts({
    entity,
    disabled: disabled || isChat,
    examples: examples as Platform.Common.Voice.Models.Intent.Prompt[],
    onAccept,
    intentName,
    intentInputs,
  });

  return (isChat ? gptGenChat : gptGenVoice) as unknown as GenApi<unknown>;
};
