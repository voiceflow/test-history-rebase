import React from 'react';

import { ModalType } from '@/constants';
import { useModals } from '@/hooks';
import { ClassName } from '@/styles/constants';

import { ManageTagInput, SelectOnlyTagInput } from './components';
import { InputVariant } from './constants';
import { ReportTagInputProvider } from './context';

export * from './constants';

export interface ReportTagInputProps {
  variant?: InputVariant;
  onChange?: (tags: string[]) => void;
  selectedTags: string[];
}

const ReportTagInput: React.ForwardRefRenderFunction<HTMLInputElement, ReportTagInputProps> = ({
  variant = InputVariant.MANAGE,
  selectedTags,
  onChange,
  ...props
}) => {
  const { open: openTagManager } = useModals(ModalType.TAG_MANAGER);

  return (
    <ReportTagInputProvider selectedTags={selectedTags}>
      {variant === InputVariant.MANAGE ? (
        <ManageTagInput
          className={ClassName.BASE_REPORT_TAG_INPUT}
          selectedTags={selectedTags}
          footerAction
          footerActionLabel="Manage Tags"
          onClickFooterAction={openTagManager}
          {...props}
        />
      ) : (
        <SelectOnlyTagInput
          hasRadioButtons
          isSelectedFunc={(id: string) => {
            return selectedTags?.includes(id);
          }}
          selectedTags={selectedTags}
          onChange={onChange!}
          {...props}
        />
      )}
    </ReportTagInputProvider>
  );
};

export default React.forwardRef(ReportTagInput);
