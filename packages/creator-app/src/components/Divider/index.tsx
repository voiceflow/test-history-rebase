import React from 'react';

import LabeledHorizontalDivider, { LabeledHorizontalDividerProps } from './components/LabeledHorizontalDivider';
import SimpleDivider, { SimpleDividerProps } from './components/SimpleDivider';

interface DividerProps extends Omit<SimpleDividerProps, 'theme'>, LabeledHorizontalDividerProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const Divider: React.ForwardRefRenderFunction<HTMLDivElement, DividerProps> = ({ children, ...props }, ref) =>
  children ? (
    <LabeledHorizontalDivider ref={ref} {...props}>
      {children}
    </LabeledHorizontalDivider>
  ) : (
    <SimpleDivider ref={ref} {...props} />
  );

export default React.forwardRef(Divider);
