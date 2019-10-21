import { BlockType } from '@/constants';
import UserAltIcon from '@/svgs/solid/user-alt.svg';

import InteractionBlock from './InteractionBlock';
import InteractionEditor from './InteractionEditor';

const InteractionManager = {
  type: BlockType.INTERACTION,
  block: InteractionBlock,
  editor: InteractionEditor,
  icon: UserAltIcon,

  label: 'Interaction',
  tip: 'Select choices and capture slot values from user input',

  platformDependent: true,
  reprompt: true,
  chips: true,
  mergeTerminator: true,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: 'Interaction',
      alexa: [],
      google: [],
    },
  }),
};

export default InteractionManager;
