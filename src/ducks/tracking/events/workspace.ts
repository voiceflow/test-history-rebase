import client from '@/client';
import { Workspace } from '@/models';

export const trackWorkspace = (workspace: Workspace) => () => client.analytics.identifyWorkspace(workspace);
