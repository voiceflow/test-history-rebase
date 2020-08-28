import React from 'react';

import Onboarding from '@/pages/Onboarding';

const OnboardingComp: any = Onboarding;

const NewWorkspace: React.FC = () => <OnboardingComp firstTime={false} />;

export default NewWorkspace;
