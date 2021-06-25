import React from 'react';

import { HeaderLogoButton } from '@/components/ProjectPage';

import { useLogoButtonOptions } from '../../../hooks';

const LogoButton: React.FC = () => {
  const logoOptions = useLogoButtonOptions({ uiToggle: true, shortcuts: true });

  return <HeaderLogoButton options={logoOptions} />;
};

export default LogoButton;
