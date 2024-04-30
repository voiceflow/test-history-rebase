import type React from 'react';

import { Config as ConfigUtils } from '@/configs/utils';
import { Types } from '@/utils';

export interface Config {
  /**
   * @example 'Invocation Name' | 'Agent Name'
   */
  name: string;

  /**
   * @example 'Enter invocation name'
   */
  placeholder: string;

  /**
   * @example 'The name of your agent as seen on Dialogflow.'
   */
  description: React.ReactNode;

  /**
   * @example 'Invocations' | 'Web Demo Trigger Phrase'
   */
  samplesName: string;

  /**
   * invocation name will be injected as the end
   * @example 'open' | 'start'
   */
  defaultSamples: string[];

  /**
   * @example 'Enter invocation'
   */
  samplesPlaceholder: string;

  /**
   * @example 'This is the phrase you will input to initiate the web demo integration on the Dialogflow console.'
   */
  samplesDescription: string;
}

export const CONFIG = Types.satisfies<Config>()({
  name: 'Invocation Name',

  placeholder: 'Enter an invocation name',

  description: 'Invocation name description',

  samplesName: 'Invocations',

  defaultSamples: ['open', 'start', 'launch'],

  samplesPlaceholder: 'Enter an invocation',

  samplesDescription: 'Invocations description',
});

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
