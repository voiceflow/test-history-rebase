import { NLPType } from '../constants';
import * as Base from './base';

export const CONFIG = Base.extend({
  type: NLPType.LUIS,

  name: 'Microsoft LUIS',

  icon: {
    name: 'luis',
    color: '#669DF6',
  },

  import: null,

  export: null,
})(Base.validate);

export type Config = typeof CONFIG;
