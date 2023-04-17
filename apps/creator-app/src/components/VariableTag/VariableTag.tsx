import { OverflowTippyTooltip, OverflowTippyTooltipTypes } from '@voiceflow/ui';
import React from 'react';

import { BaseVariableTagProps, VariableTagContent, VariableTagTooltipStyles, VariableTagWrapper } from './styles';

export interface VariableTagProps extends BaseVariableTagProps {
  tooltip?: Omit<OverflowTippyTooltipTypes.Props, 'children' | 'content'>;
  children: string;
}

export const VariableTag = ({ tooltip, children, ...props }: VariableTagProps): React.ReactElement => (
  <OverflowTippyTooltip {...tooltip} content={`{${children}}`} overflow>
    {(ref, { isOverflow }) => (
      <>
        <VariableTagWrapper {...props}>
          <span>{'{'}</span>
          <VariableTagContent ref={ref}>{children}</VariableTagContent>
          <span>{'}'}</span>
        </VariableTagWrapper>

        {isOverflow && <VariableTagTooltipStyles />}
      </>
    )}
  </OverflowTippyTooltip>
);
