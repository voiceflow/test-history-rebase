import { Project } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';

export const useIntentDescriptionPlaceholder = () => {
  return useSelector(Project.active.isLLMClassifier) ? 'Trigger this intent when…' : 'Enter intent description (optional)';
};
