import React from 'react';

import { ManageTagInput, SelectOnlyTagInput } from './components';
import { InputVariant } from './constants';

export * from './constants';

interface BaseReportTagInputProps {
  variant?: InputVariant;
  selectedTags: string[];
}
interface SelectOnlyReportTagInputProps extends BaseReportTagInputProps {
  variant: InputVariant.SELECT_ONLY;
  onChange: (tags: string[]) => void;
}

interface InternalReportTagInputProps extends BaseReportTagInputProps {
  variant?: InputVariant;
  onChange?: (tags: string[]) => void;
}

function ReportTagInput(props: BaseReportTagInputProps): React.ReactElement;
function ReportTagInput(props: SelectOnlyReportTagInputProps): React.ReactElement;
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function ReportTagInput({
  variant = InputVariant.MANAGE,
  selectedTags,
  onChange,
}: InternalReportTagInputProps): React.ReactElement {
  return variant === InputVariant.MANAGE ? (
    <ManageTagInput selectedTags={selectedTags} />
  ) : (
    <SelectOnlyTagInput onChange={onChange!} selectedTags={selectedTags} />
  );
}

export default ReportTagInput;
