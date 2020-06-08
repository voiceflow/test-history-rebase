import cuid from 'cuid';

import { BlockType, DialogType } from '@/constants';
import { NodeData } from '@/models';
import { NoReplyResponseForm } from '@/pages/Canvas/components/NoReplyResponse';

import { NodeConfig } from '../types';
import PromptEditor from './PromptEditor';
import PromptStep from './PromptStep';
import { RepromptsForm } from './components';

const EDITORS_BY_PATH = {
  reprompts: RepromptsForm,
  noReplyResponse: NoReplyResponseForm,
};

const PromptManager: NodeConfig<NodeData.Prompt> = {
  type: BlockType.PROMPT,
  icon: 'prompt',
  iconColor: '#4D5CAD',

  label: 'Prompt',
  tip: 'Prompts will stop & listen to the user to match an intent',

  step: PromptStep,
  editor: PromptEditor,
  editorsByPath: EDITORS_BY_PATH,

  factory: () => ({
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
            voice: 'Alexa',
            content: '',
          },
        ],
      },
      reprompt: null,
    },
  }),
};

export default PromptManager;
