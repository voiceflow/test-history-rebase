import * as Base from '@/configs/base';
import { Config as ConfigUtils } from '@/configs/utils';

export const CONFIG = Base.Project.InvocationName.extend({
  name: 'Agent Name',

  description: 'The name of your agent as seen on Dialogflow.',

  placeholder: 'Enter an agent name',

  samplesName: 'Web Demo Trigger Phrase',

  samplesPlaceholder: 'Enter a phrase to trigger the Dialogflow web demo integration',

  samplesDescription:
    'This is the phrase you will input to initiate the web demo integration on the Dialogflow console.',
})(Base.Project.InvocationName.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
