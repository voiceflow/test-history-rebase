import React from 'react';

import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

export type IdentityContextValue = {
  activePlan: ReturnType<typeof Workspace.planTypeSelector>;
  activeRole: ReturnType<typeof Workspace.userRoleSelector>;
};

export const IdentityContext = React.createContext<IdentityContextValue | null>(null);

const UnconnectedIdentityProvider: React.FC<ConnectedIdentityProviderProps> = ({ activePlan, activeRole, children }) => (
  <IdentityContext.Provider value={{ activePlan, activeRole }}>{children}</IdentityContext.Provider>
);

const mapStateToProps = {
  activePlan: Workspace.planTypeSelector,
  activeRole: Workspace.userRoleSelector,
};

type ConnectedIdentityProviderProps = ConnectedProps<typeof mapStateToProps>;

export const IdentityProvider = connect(mapStateToProps)(UnconnectedIdentityProvider);
