import { PlanName } from '@voiceflow/dtos';

export const isPlanName = (value: string): value is PlanName => {
  return Object.values(PlanName).includes(value as PlanName);
};
