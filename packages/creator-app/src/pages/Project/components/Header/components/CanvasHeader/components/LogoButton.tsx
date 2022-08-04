import React, { useContext } from 'react';

import { HeaderLogoButton } from '@/components/ProjectPage';
import { SearchContext } from '@/contexts/SearchContext';

import { useLogoButtonOptions } from '../../../hooks';

interface LogoButtonProps {
  style?: React.CSSProperties;
}

const LogoButton: React.FC<LogoButtonProps> = (props) => {
  const search = useContext(SearchContext);
  const logoOptions = useLogoButtonOptions({ uiToggle: true, shortcuts: true, toggleSearch: search?.toggle });

  return <HeaderLogoButton options={logoOptions} {...props} />;
};

export default LogoButton;
