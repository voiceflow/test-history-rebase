/* eslint-disable @typescript-eslint/no-empty-interface */
import { CRUDState } from '@/ducks/utils/crudV2';
import { Workspace } from '@/models';

export interface RealtimeWorkspaceState extends CRUDState<Workspace> {}
