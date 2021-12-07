import * as WorkspaceV2 from '@/ducks/workspaceV2';

import { useSelector } from './redux';

// eslint-disable-next-line import/prefer-default-export
export const useActiveWorkspace = () => useSelector(WorkspaceV2.active.workspaceSelector);
