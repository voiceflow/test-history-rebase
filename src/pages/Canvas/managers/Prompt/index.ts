import cuid from 'cuid';

import { BlockType, DialogType } from '@/constants';
import { NodeData } from '@/models';
import { NoReplyResponseForm } from '@/pages/Canvas/components/NoReplyResponse';
import { ChipForm } from '@/pages/Canvas/components/SuggestionChips';

import { NodeConfig } from '../types';
import { RepromptsForm } from './components';
import PromptEditor from './PromptEditor';
import PromptStep from './PromptStep';

const EDITORS_BY_PATH = {
  reprompts: RepromptsForm,
  noReplyResponse: NoReplyResponseForm,
  chips: ChipForm,
};

const PromptManager: NodeConfig<NodeData.Prompt> = {
  type: BlockType.PROMPT,
  icon: 'prompt',
  iconColor: '#5C6BC0',

  mergeTerminator: true,

  label: 'Prompt',
  tip: 'Prompts will stop & listen to the user to match an intent',

  step: PromptStep,
  editor: PromptEditor,
  editorsByPath: EDITORS_BY_PATH,

  factory: (_, options) => ({
    node: {
      ports: {
        in: [{}],
      },
    },
    data: {
      name: 'Prompt',
      noMatchReprompt: {
        randomize: false,
        reprompts: [
          {
            id: cuid.slug(),
            type: DialogType.VOICE,
            voice: options?.defaultVoice ?? '',
            content: '',
          },
        ],
      },
      reprompt: null,
      chips: null,
    },
  }),
};

export default PromptManager;
