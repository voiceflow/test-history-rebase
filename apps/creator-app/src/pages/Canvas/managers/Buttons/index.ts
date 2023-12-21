import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';
import { NodeCategory } from '@/contexts/SearchContext/types';
import { Designer } from '@/ducks';

import { NodeManagerConfigV2 } from '../types';
import { Editor, Step } from './components';
import { NODE_CONFIG } from './constants';

const ButtonsManager: NodeManagerConfigV2<Realtime.NodeData.Buttons, Realtime.NodeData.ButtonsBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Buttons',
  projectTypes: [Platform.Constants.ProjectType.CHAT],

  step: Step,
  editorV2: Editor,

  searchCategory: NodeCategory.USER_INPUT,
  getSearchParams: (data, state) =>
    data.buttons.reduce<string[]>((acc, button) => {
      if (button.name) acc.push(button.name);

      const intent = Designer.Intent.selectors.oneWithFormattedBuiltNameByID(state, { id: button.intent });

      if (intent?.name) acc.push(intent.name);

      return acc;
    }, []),

  tooltipText: 'Interactive buttons connected to URLs or conversation paths.',
  tooltipLink: Documentation.BUTTONS_STEP,
};

export default ButtonsManager;
