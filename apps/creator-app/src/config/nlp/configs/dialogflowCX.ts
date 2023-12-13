import { NLPType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  type: NLPType.DIALOGFLOW_CX,

  name: 'Dialogflow CX',

  icon: {
    name: 'dialogflowCX',
    color: '#669DF6',
  },

  export: null,
})(Base.validate);

export type Config = typeof CONFIG;
