import React from 'react';

import { ManageTagInput, SelectOnlyTagInput } from './components';
import { InputVariant } from './constants';
import { ReportTagInputProvider } from './context';

export * from './constants';

export type ReportTagInputProps = {
  variant?: InputVariant;
};

const ReportTagInput: React.ForwardRefRenderFunction<HTMLInputElement, ReportTagInputProps & React.ComponentProps<typeof ManageTagInput>> = ({
  variant = InputVariant.MANAGE,
  ...props
}) => {
  return (
    <ReportTagInputProvider selectedTags={props.selectedTags}>
      {variant === InputVariant.MANAGE ? <ManageTagInput {...props} /> : <SelectOnlyTagInput {...props} />}
    </ReportTagInputProvider>
  );
};

export default React.forwardRef(ReportTagInput);
