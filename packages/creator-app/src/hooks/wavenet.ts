import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';

export const useHasWavenet = () => {
  const isEnterprise = useSelector(WorkspaceV2.active.isEnterpriseSelector);
  return { hasWavenet: !!isEnterprise };
};
