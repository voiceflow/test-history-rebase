import * as DiagramV2 from '@/ducks/diagramV2';
import { useSelector } from '@/hooks';

export const useNodeLabel = () => {
  const isTopic = useSelector(DiagramV2.active.isTopicSelector);

  return isTopic ? 'Home' : 'Continue';
};
