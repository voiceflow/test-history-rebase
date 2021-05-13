import { WrappedFieldInputProps, WrappedFieldMetaProps } from 'redux-form';

export interface WrappedFormControlProps
  extends Pick<WrappedFieldInputProps, 'value' | 'onChange'>,
    Omit<Partial<WrappedFieldInputProps>, 'value' | 'onChange'>,
    Pick<Partial<WrappedFieldMetaProps>, 'touched' | 'error' | 'warning'> {}
