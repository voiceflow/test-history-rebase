import NotWithWorkspaceIdStrategy from './notWithWorkspaceId';
import Strategy from './strategy';
import WithOrganizationIdStrategy from './withOrganizationId';
import WithWorkspaceCreatedAfter from './withWorkspaceCreatedAfter';
import WithWorkspaceIdStrategy from './withWorkspaceId';

export type { InternalContext as StrategiesContext } from './strategy';

const strategies: Strategy[] = [
  new WithOrganizationIdStrategy(),
  new WithWorkspaceIdStrategy(),
  new NotWithWorkspaceIdStrategy(),
  new WithWorkspaceCreatedAfter(),
];

export default strategies;
