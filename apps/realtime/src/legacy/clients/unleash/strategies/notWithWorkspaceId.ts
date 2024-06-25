import type { Context } from './strategy';
import Strategy from './strategy';

class NotWithWorkspaceID extends Strategy {
  constructor() {
    super('notWithWorkspaceId');
  }

  isEnabled({ workspaceIds }: { workspaceIds: string }, { workspaceID }: Context): boolean {
    return !this.includes(workspaceIds, workspaceID);
  }
}

export default NotWithWorkspaceID;
