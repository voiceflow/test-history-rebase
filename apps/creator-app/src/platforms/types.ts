import type { JobContextValue } from '@/hooks/job';
import type { Job, JobStage } from '@/models';

import type * as Alexa from './alexa';
import type * as DialogflowCX from './dialogflowCX';
import type * as General from './general';

export type PlatformClient = typeof Alexa.client | typeof DialogflowCX.client | typeof General.client;

export type StageComponentProps<S extends JobStage, J extends Job<S> = Job<S>> = JobContextValue<J> & { stage: S };

export interface StageContent<J extends Job<any>> {
  Component?: React.FC<StageComponentProps<J['stage'], J>>;
  Popup?: { Component: React.FC<StageComponentProps<J['stage'], J>>; dismissable?: boolean; closeable?: boolean };
}

export type StageContentMap<J extends Job<any>> = {
  [K in J['stage']['type']]?: StageContent<Job<Extract<J['stage'], { type: K }>>>;
};
