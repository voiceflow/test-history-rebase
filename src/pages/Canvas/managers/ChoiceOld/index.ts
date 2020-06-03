import { BlockType } from '@/constants';
import { NodeData } from '@/models';
import { NoReplyResponseForm } from '@/pages/Canvas/components/NoReplyResponse';
import ProjectDiagramIcon from '@/svgs/solid/project-diagram.svg';

import { NodeConfig } from '../types';
import ChoiceOldEditor from './ChoiceOldEditor';
import ChoiceOldStep from './ChoiceOldStep';

const EDITORS_BY_PATH = {
  noReplyResponse: NoReplyResponseForm,
};

const ChoiceOldManager: NodeConfig<NodeData.Choice> = {
  type: BlockType.CHOICE_OLD,
  icon: ProjectDiagramIcon,
  reprompt: true,
  chips: true,
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
