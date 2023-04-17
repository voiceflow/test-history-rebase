import { READABLE_VARIABLE_REGEXP, Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { serializeToText } from '@voiceflow/slate-serializer/text';
import { useDidUpdateEffect, useTeardown } from '@voiceflow/ui';

import client from '@/client';
import * as SlateEditor from '@/components/SlateEditable/editor';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as SlotV2 from '@/ducks/slotV2';
import * as VersionV2 from '@/ducks/versionV2';
import { useActiveProjectType, useSelector } from '@/hooks';
import { slotToString, transformVariablesToReadable } from '@/utils/slot';

import { GenApi, useGen } from './gen';

export const useGenVoicePrompts = ({
  examples,
  onAccept,
  disabled,
  generateBuiltIn,
  acceptAllOnChange,
}: {
  examples: Platform.Common.Voice.Models.Prompt.Model[];
  onAccept: (items: Platform.Common.Voice.Models.Prompt.Model[]) => void;
  disabled?: boolean;
  generateBuiltIn?: (options: { quantity: number }) => Promise<string[]> | string[];
  acceptAllOnChange?: boolean;
}): GenApi<Platform.Common.Voice.Models.Prompt.Model> => {
  const slotNameMap = useSelector(SlotV2.slotNameMapSelector);
  const defaultVoice = useSelector(VersionV2.active.voice.defaultVoiceSelector);

  const api = useGen<Platform.Common.Voice.Models.Prompt.Model>({
    onAccept,
    disabled,
    examples,

    examplesToDB: (items) =>
      items
        .filter((item) => item.type === Platform.Common.Voice.Models.Prompt.PromptType.TEXT)
        .map((item) => transformVariablesToReadable(item.content).trim())
        .filter(Boolean),

    dbExamplesToTrack: (items) => items,

    generate: async (options) => {
      const exampleVoice = examples.find((item) => item.type === Platform.Common.Voice.Models.Prompt.PromptType.TEXT && item.voice)?.voice;

      let results: string[] = [];

      if (!options.examples.length && generateBuiltIn) {
        results = await generateBuiltIn({ quantity: options.quantity });
      } else {
        ({ results } = await client.gptGen.genPrompts({ ...options, format: 'ssml' }));
      }

      return results.map((result) => ({
        id: Utils.id.cuid.slug(),
        type: Platform.Common.Voice.Models.Prompt.PromptType.TEXT,
        voice: exampleVoice ?? defaultVoice,
        content: result.replace(READABLE_VARIABLE_REGEXP, (_, name) => slotToString(slotNameMap[name] ?? { id: name, name })),
      }));
    },
  });

  useDidUpdateEffect(() => {
    if (!acceptAllOnChange) {
      api.onAcceptAll();
    }
  }, [acceptAllOnChange]);

  useTeardown(() => api.onAcceptAll());

  return api;
};

export const useGenChatPrompts = ({
  examples,
  onAccept,
  disabled,
  generateBuiltIn,
  acceptAllOnChange,
}: {
  examples: Platform.Common.Chat.Models.Prompt.Model[];
  onAccept: (items: Platform.Common.Chat.Models.Prompt.Model[]) => void;
  disabled?: boolean;
  generateBuiltIn?: (options: { quantity: number }) => Promise<string[]> | string[];
  acceptAllOnChange?: boolean;
}): GenApi<Platform.Common.Chat.Models.Prompt.Model> => {
  const variables = useSelector(DiagramV2.active.allSlotsAndVariablesNormalizedSelector);

  const api = useGen<Platform.Common.Chat.Models.Prompt.Model>({
    onAccept,
    disabled,
    examples,

    examplesToDB: (items) => items.map((item) => serializeToText(item.content).trim()).filter(Boolean),

    dbExamplesToTrack: (items) => items,

    generate: async (options) => {
      let results: string[] = [];

      if (!options.examples.length && generateBuiltIn) {
        results = await generateBuiltIn({ quantity: options.quantity });
      } else {
        ({ results } = await client.gptGen.genPrompts({ ...options, format: 'text' }));
      }

      const editor = SlateEditor.createEditor([SlateEditor.PluginType.VARIABLES]);

      editor.pluginsOptions = { [SlateEditor.PluginType.VARIABLES]: { variables } };

      return results.map((result) => ({
        id: Utils.id.cuid.slug(),
        content: [{ children: editor.processText({ originalText: result }) }],
      }));
    },
  });

  useDidUpdateEffect(() => {
    if (!acceptAllOnChange) {
      api.onAcceptAll();
    }
  }, [acceptAllOnChange]);

  useTeardown(() => api.onAcceptAll());

  return api;
};

export const useGenPrompts = ({
  examples,
  onAccept,
  disabled,
  generateBuiltIn,
  acceptAllOnChange,
}: {
  examples: Platform.Base.Models.Prompt.Model[];
  onAccept: (items: Platform.Base.Models.Prompt.Model[]) => void;
  disabled?: boolean;
  generateBuiltIn?: (options: { quantity: number }) => Promise<string[]> | string[];
  acceptAllOnChange?: boolean;
}): GenApi<Platform.Base.Models.Prompt.Model> => {
  const projectType = useActiveProjectType();

  const isChat = Platform.Common.Chat.CONFIG.is(projectType);

  const gptGenChat = useGenChatPrompts({
    disabled: disabled || !isChat,
    examples: examples as Platform.Common.Chat.Models.Prompt.Model[],
    onAccept,
    generateBuiltIn,
    acceptAllOnChange,
  });
  const gptGenVoice = useGenVoicePrompts({
    disabled: disabled || isChat,
    examples: examples as Platform.Common.Voice.Models.Prompt.Model[],
    onAccept,
    generateBuiltIn,
    acceptAllOnChange,
  });

  return (isChat ? gptGenChat : gptGenVoice) as unknown as GenApi<Platform.Base.Models.Prompt.Model>;
};
