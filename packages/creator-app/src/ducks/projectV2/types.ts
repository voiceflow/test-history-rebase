/* eslint-disable @typescript-eslint/no-empty-interface */
import { CRUDState } from '@/ducks/utils/crudV2';
import { AnyProject } from '@/models';

export interface RealtimeProjectState extends CRUDState<AnyProject> {}
