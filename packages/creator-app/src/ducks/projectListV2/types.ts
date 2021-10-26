/* eslint-disable @typescript-eslint/no-empty-interface */
import { CRUDState } from '@/ducks/utils/crudV2';
import { ProjectList } from '@/models';

export interface ProjectListState extends CRUDState<ProjectList> {}
