import * as Realtime from '@voiceflow/realtime-sdk';
import { SVG } from '@voiceflow/ui';

import { BlockType } from '@/constants';
import { NO_REPLY_RESPONSE_PATH_TYPE, NoReplyResponseForm } from '@/pages/Canvas/components/NoReplyResponse';

import { NodeManagerConfig } from '../types';
import ChoiceOldEditor from './ChoiceOldEditor';
import ChoiceOldStep from './ChoiceOldStep';

const EDITORS_BY_PATH = {
  [NO_REPLY_RESPONSE_PATH_TYPE]: NoReplyResponseForm,
};

const ChoiceOldManager: NodeManagerConfig<Realtime.NodeData.ChoiceOld> = {
  type: BlockType.CHOICE_OLD,
  icon: SVG.projectDiagram as any,
  buttons: true,
  reprompt: true,
  mergeTerminator: true,

  step: ChoiceOldStep,
  editor: ChoiceOldEditor,
  editorsByPath: EDITORS_BY_PATH,

  label: 'Choice (old)',
  tip: 'Listen for the user to make a choice from a list of options you set',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}, {}],
      },
    },
    data: {
      name: 'Choice (old)',
      choices: [
        {
          synonyms: [],
        },
      ],
      reprompt: null,
    },
  }),
};

export default ChoiceOldManager;
