/* eslint-disable @typescript-eslint/no-empty-interface */
import { CRUDState } from '@/ducks/utils/crudV2';
import { AnyProject } from '@/models';

export interface ProjectState extends CRUDState<AnyProject> {}
