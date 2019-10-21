import { BlockType } from '@/constants';
import ProjectDiagramIcon from '@/svgs/solid/project-diagram.svg';

import ChoiceEditor from './ChoiceEditor';

const ChoiceManager = {
  type: BlockType.CHOICE,
  editor: ChoiceEditor,
  icon: ProjectDiagramIcon,

  label: 'Choice',
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
      name: 'Choice',
      choices: [
        {
          synonyms: [],
          open: true,
        },
      ],
    },
  }),
};

export default ChoiceManager;
