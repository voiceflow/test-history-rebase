import { JobContextValue } from '@/hooks/job';
import { Job, JobStage } from '@/models';

import * as Alexa from './alexa';
import * as DialogflowCX from './dialogflowCX';
import * as DialogflowES from './dialogflowES';
import * as General from './general';
import * as Google from './google';

export type PlatformClient =
  | typeof Alexa.client
  | typeof Google.client
  | typeof DialogflowES.client
  | typeof DialogflowCX.client
  | typeof General.client;

export type StageComponentProps<S extends JobStage, J extends Job<S> = Job<S>> = JobContextValue<J> & { stage: S };

export interface StageContent<J extends Job<any>> {
  Component?: React.FC<StageComponentProps<J['stage'], J>>;
  Popup?: { Component: React.FC<StageComponentProps<J['stage'], J>>; dismissable?: boolean; closeable?: boolean };
}

export type StageContentMap<J extends Job<any>> = {
  [K in J['stage']['type']]?: StageContent<Job<Extract<J['stage'], { type: K }>>>;
};
