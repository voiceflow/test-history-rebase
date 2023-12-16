import React from 'react';

import { CMSFormDescription } from '@/components/CMS/CMSForm/CMSFormDescription/CMSFormDescription.component';
import { Project } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';

export const IntentDescription: React.FC<Omit<React.ComponentProps<typeof CMSFormDescription>, 'placeholder'>> = (props) => {
  const placeholder = useSelector(Project.active.isLLMClassifier) ? 'Trigger this intent when…' : 'Enter intent description (optional)';

  return <CMSFormDescription placeholder={placeholder} {...props} />;
};
