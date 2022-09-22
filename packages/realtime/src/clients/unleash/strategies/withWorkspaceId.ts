import Strategy, { Context } from './strategy';

class WithWorkspaceID extends Strategy {
  constructor() {
    super('withWorkspaceId');
  }

  isEnabled({ workspaceIds }: { workspaceIds: string }, { workspaceID }: Context): boolean {
    return this.includes(workspaceIds, workspaceID);
  }
}

export default WithWorkspaceID;
