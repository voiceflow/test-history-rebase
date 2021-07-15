import { Viewer } from '@voiceflow/realtime-sdk';

export interface RealtimeProjectState {
  [projectID: string]: {
    awareness: {
      [tabID: string]: Viewer;
    };
  };
}
