/* eslint-disable @typescript-eslint/no-empty-interface */
import { Workspace } from '@/models';

import { CRUDState } from '../utils';

export interface RealtimeWorkspaceState extends CRUDState<Workspace> {}
