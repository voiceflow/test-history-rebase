/* eslint-disable @typescript-eslint/no-empty-interface */
import { CRUDState } from '@/ducks/utils/crudV2';
import { AnyVersion } from '@/models';

export interface VersionState extends CRUDState<AnyVersion> {}
