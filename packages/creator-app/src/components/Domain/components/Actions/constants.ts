import { BaseModels } from '@voiceflow/base-types';

export const STATUS_LABELS_MAP = {
  [BaseModels.Version.DomainStatus.DESIGN]: 'Design',
  [BaseModels.Version.DomainStatus.REVIEW]: 'Review',
  [BaseModels.Version.DomainStatus.COMPLETE]: 'Complete',
};
