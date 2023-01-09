import React from 'react';

import { Pane } from './components';
import { SwitchContext } from './context';

interface SwitchProps extends React.PropsWithChildren {
  active: string | number | boolean;
}

const Switch: React.FC<SwitchProps> = ({ children, active }) => <SwitchContext.Provider value={active}>{children}</SwitchContext.Provider>;

export default Object.assign(Switch, { Pane });
