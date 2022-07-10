import React, { useContext } from 'react';

import { HeaderLogoButton } from '@/components/ProjectPage';
import { SearchContext } from '@/contexts/SearchContext';

import { useLogoButtonOptions } from '../../../hooks';

const LogoButton: React.FC = () => {
  const search = useContext(SearchContext);
  const logoOptions = useLogoButtonOptions({ uiToggle: true, shortcuts: true, toggleSearch: search?.toggle });

  return <HeaderLogoButton options={logoOptions} />;
};

export default LogoButton;
