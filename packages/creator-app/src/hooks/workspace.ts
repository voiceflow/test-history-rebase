import * as WorkspaceV2 from '@/ducks/workspaceV2';

import { useSelector } from './redux';

export const useActiveWorkspace = () => useSelector(WorkspaceV2.active.workspaceSelector);
