import React from 'react';

import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useContextApi } from '@/hooks/cache';
import { ConnectedProps } from '@/types';

export type IdentityContextValue = {
  activePlan: ReturnType<typeof Workspace.planTypeSelector>;
  activeRole: ReturnType<typeof Workspace.userRoleSelector>;
};

export const IdentityContext = React.createContext<IdentityContextValue | null>(null);

const UnconnectedIdentityProvider: React.FC<ConnectedIdentityProviderProps> = ({ activePlan, activeRole, children }) => {
  const api = useContextApi({ activePlan, activeRole });

  return <IdentityContext.Provider value={api}>{children}</IdentityContext.Provider>;
};

const mapStateToProps = {
  activePlan: Workspace.planTypeSelector,
  activeRole: Workspace.userRoleSelector,
};

type ConnectedIdentityProviderProps = ConnectedProps<typeof mapStateToProps>;

export const IdentityProvider = connect(mapStateToProps)(UnconnectedIdentityProvider);
