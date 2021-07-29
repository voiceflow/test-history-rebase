/* eslint-disable @typescript-eslint/no-empty-interface */
import { ProjectList } from '@/models';

import { CRUDState } from '../utils';

export interface RealtimeProjectListState extends CRUDState<ProjectList> {}
