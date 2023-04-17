import { Utils } from '@voiceflow/common';

export interface PageProgressOptions {
  timeout: number;
  step: number;
  stepInterval: number;
  maxDuration: number;
}

interface RootPageProgressBarApi {
  stop: (type: string) => void;
  start: (type: string, options?: Partial<PageProgressOptions>) => void;
}

export const PageProgress: RootPageProgressBarApi = {
  stop: Utils.functional.noop,
  start: Utils.functional.noop,
};
