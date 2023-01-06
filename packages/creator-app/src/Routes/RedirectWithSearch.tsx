import React from 'react';
import { Redirect, RedirectProps } from 'react-router-dom';

export interface RedirectWithSearchProps extends RedirectProps {
  to: string;
}

const RedirectWithSearch: React.OldFC<RedirectWithSearchProps> = ({ to, ...props }) => (
  <Redirect {...props} to={`${to.split('?')[0]}${window.location.search}`} />
);

export default RedirectWithSearch;
