import React from 'react';

import { OnboardingContextProps, withOnboarding } from '../context';

const AddCollaborators: React.FC<OnboardingContextProps> = () => {
  return <div>Add collaborators...</div>;
};

export default withOnboarding(AddCollaborators);
