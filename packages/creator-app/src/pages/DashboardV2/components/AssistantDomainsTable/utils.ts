import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

export const getCountByStatus = (options: Realtime.Domain[], status: BaseModels.Version.DomainStatus) =>
  options.filter((option) => option.status === status).length;
