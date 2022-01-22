import { Utils } from '@voiceflow/common';

interface RootPageProgressBarApi {
  stop: (type: string) => void;
  start: (type: string) => void;
}

export const PageProgress: RootPageProgressBarApi = {
  stop: Utils.functional.noop,
  start: Utils.functional.noop,
};
