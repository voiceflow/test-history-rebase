import cuid from 'cuid';

import IntentSlotForm from '@/components/IntentSlotForm';
import { BlockType } from '@/constants';
import { NoReplyResponseForm } from '@/pages/Canvas/components/NoReplyResponse';
import UserAltIcon from '@/svgs/solid/user-alt.svg';

import ChoiceEditor from './ChoiceEditor';
import ChoiceStep from './ChoiceStep';

const EDITORS_BY_PATH = {
  slot: IntentSlotForm,
  noReplyResponse: NoReplyResponseForm,
};

const ChoiceManager = {
  type: BlockType.CHOICE,
  icon: UserAltIcon,

  editor: ChoiceEditor,
  step: ChoiceStep,

  editorsByPath: EDITORS_BY_PATH,

  label: 'Choice',
  tip: 'Select choices and capture slot values from user input',

  platformDependent: true,
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
          id: cuid.slug(),
          alexa: {},
          google: {},
        },
      ],
    },
  }),
};

export default ChoiceManager;
