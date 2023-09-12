import dayjs from 'dayjs';

import Strategy, { Context } from './strategy';

class WithWorkspaceCreatedAfterStrategy extends Strategy {
  constructor() {
    super('withWorkspaceCreatedAfter');
  }

  isEnabled(parameters: { workspaceCreatedAfter: string }, { workspaceCreatedAt }: Context): boolean {
    const workspaceCreatedAtDate = workspaceCreatedAt ? new Date(workspaceCreatedAt) : null;
    const workspaceCreatedAfterDate = parameters.workspaceCreatedAfter ? new Date(parameters.workspaceCreatedAfter) : null;

    return (
      !!workspaceCreatedAtDate &&
      !!workspaceCreatedAfterDate &&
      dayjs(workspaceCreatedAtDate).isValid() &&
      dayjs(workspaceCreatedAfterDate).isValid() &&
      dayjs(workspaceCreatedAtDate).isAfter(workspaceCreatedAfterDate)
    );
  }
}

export default WithWorkspaceCreatedAfterStrategy;
