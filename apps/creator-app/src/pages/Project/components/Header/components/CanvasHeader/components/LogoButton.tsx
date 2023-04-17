import React, { useContext } from 'react';

import Page from '@/components/Page';
import { SearchContext } from '@/contexts/SearchContext';

import { useLogoButtonOptions } from '../../../hooks';

interface LogoButtonProps {
  style?: React.CSSProperties;
}

const LogoButton: React.FC<LogoButtonProps> = (props) => {
  const search = useContext(SearchContext);
  const logoOptions = useLogoButtonOptions({ uiToggle: true, shortcuts: true, toggleSearch: search?.toggle });

  return <Page.Header.LogoButton options={logoOptions} {...props} />;
};

export default LogoButton;
