import * as Realtime from '@voiceflow/realtime-sdk';
import { markupToString } from '@voiceflow/utils-designer';

import { BUTTONS_STEP } from '@/config/documentation';
import { NodeCategory } from '@/contexts/SearchContext/types';
import { Designer } from '@/ducks';

import { NodeManagerConfigV3 } from '../types';
import { ButtonsV2Step } from './ButtonsV2.step';
import { ButtonsV2Editor } from './ButtonsV2Editor/ButtonsV2.editor';
import { BUTTONS_V2_NODE_CONFIG } from './ButtonsV2Manager.constants';

export const ButtonsV2Manager: NodeManagerConfigV3<Realtime.NodeData.ButtonsV2> = {
  ...BUTTONS_V2_NODE_CONFIG,
  label: 'Buttons',

  step: ButtonsV2Step,
  editorV3: ButtonsV2Editor,

  searchCategory: NodeCategory.USER_INPUT,
  getSearchParams: (data, state) =>
    data.items.reduce<string[]>((acc, button) => {
      acc.push(
        markupToString.fromDB(button.label, {
          entitiesMapByID: Designer.Entity.selectors.map(state),
          variablesMapByID: Designer.Variable.selectors.map(state),
        })
      );

      return acc;
    }, []),

  tooltipText: 'Interactive buttons connected to URLs or conversation paths.',
  tooltipLink: BUTTONS_STEP,
};
