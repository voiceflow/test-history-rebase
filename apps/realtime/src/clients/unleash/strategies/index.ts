import NotWithWorkspaceIdStrategy from './notWithWorkspaceId';
import Strategy from './strategy';
import WithOrganizationIdStrategy from './withOrganizationId';
import WithWorkspaceIdStrategy from './withWorkspaceId';

export { InternalContext as StrategiesContext } from './strategy';

const strategies: Strategy[] = [new WithOrganizationIdStrategy(), new WithWorkspaceIdStrategy(), new NotWithWorkspaceIdStrategy()];

export default strategies;
