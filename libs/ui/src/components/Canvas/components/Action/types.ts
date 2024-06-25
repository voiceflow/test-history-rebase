import type React from 'react';

export interface Props {
  icon: React.ReactNode;
  port?: React.ReactNode;
  label?: React.ReactNode;
  nodeID?: string;
  active?: boolean;
  onClick?: React.MouseEventHandler;
  reversed?: boolean;
  onDoubleClick?: React.MouseEventHandler;
}
