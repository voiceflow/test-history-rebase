import * as Realtime from '@voiceflow/realtime-sdk';
import { Normalized } from 'normal-store';

import { CRUDState } from '@/ducks/utils/crudV2';

export interface DiagramViewer extends Realtime.Viewer {
  color: string;
  creator_id: number;
}

export interface ProjectAwarenessState {
  viewers: Record<string, Record<string, Normalized<DiagramViewer>>>;
}

export interface ProjectState extends CRUDState<Realtime.AnyProject> {
  awareness: ProjectAwarenessState;
}
