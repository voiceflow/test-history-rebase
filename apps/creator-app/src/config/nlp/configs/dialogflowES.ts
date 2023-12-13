import { NLPType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  type: NLPType.DIALOGFLOW_ES,

  name: 'Dialogflow ES',

  icon: {
    name: 'dialogflow',
    color: '#FF9800',
  },
})(Base.validate);

export type Config = typeof CONFIG;
