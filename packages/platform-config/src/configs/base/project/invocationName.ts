import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';
import React from 'react';

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

  samplesPlaceholder: 'Enter an invocation',

  samplesDescription: 'Invocations description',
});

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
