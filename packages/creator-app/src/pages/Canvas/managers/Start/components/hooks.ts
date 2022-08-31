import * as CreatorV2 from '@/ducks/creatorV2';
import { useSelector } from '@/hooks';

export const useNodeLabel = () => {
  const isRootDiagram = useSelector(CreatorV2.isRootDiagramActiveSelector);

  return isRootDiagram ? 'Home' : 'Start';
};
