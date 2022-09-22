import Strategy, { Context } from './strategy';

class WithOrganizationID extends Strategy {
  constructor() {
    super('withOrganizationId');
  }

  isEnabled({ organizationIds }: { organizationIds: string }, { organizationID }: Context): boolean {
    return this.includes(organizationIds, organizationID);
  }
}

export default WithOrganizationID;
