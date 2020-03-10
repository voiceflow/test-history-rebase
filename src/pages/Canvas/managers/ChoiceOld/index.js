import { BlockType } from '@/constants';
import { NoReplyResponseForm } from '@/pages/Canvas/components/NoReplyResponse';
import ProjectDiagramIcon from '@/svgs/solid/project-diagram.svg';

import ChoiceOldEditor from './ChoiceOldEditor';
import ChoiceOldStep from './ChoiceOldStep';

const EDITORS_BY_PATH = {
  noReplyResponse: NoReplyResponseForm,
};

const ChoiceOldManager = {
  type: BlockType.CHOICE_OLD,
  icon: ProjectDiagramIcon,

  editor: ChoiceOldEditor,
  step: ChoiceOldStep,
  editorsByPath: EDITORS_BY_PATH,

  label: 'Choice (old)',
  tip: 'Listen for the user to make a choice from a list of options you set',

  reprompt: true,
  chips: true,
  mergeTerminator: true,

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
          open: true,
        },
      ],
    },
  }),
};

export default ChoiceOldManager;
