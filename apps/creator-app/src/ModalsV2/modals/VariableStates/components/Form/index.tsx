import { Box, Input } from '@voiceflow/ui';
import { useFormik } from 'formik';
import React from 'react';

import BlockSelect from '@/components/BlockSelect';
import InputError from '@/components/InputError';
import Section from '@/components/Section';
import { SectionVariant } from '@/components/Section/constants';
import VariableList from '@/components/VariableList';
import VariablesSelect from '@/components/VariablesSelect';

import { SCHEME } from './constants';
import * as S from './styles';
import type { FormValues, Value } from './types';

export * as FormTypes from './types';

interface Props {
  value?: Value | null;
  onSubmit: (value: Value) => void;
}

const FORM_ID = 'variable-state-form';

const Form: React.FC<Props> = ({ value, onSubmit }) => {
  const initialValues = React.useMemo((): FormValues => {
    if (!value) return { name: '', startFrom: null, variables: [], variablesValues: {} };

    return {
      name: value.name,
      startFrom: value.startFrom || null,
      variables: Object.keys(value.variables || {}),
      variablesValues: Object.fromEntries(
        Object.entries(value.variables || {}).map(([key, value]) => [key, String(value)])
      ),
    };
  }, [value]);

  const onSubmitForm = (values: FormValues) => {
    const startFrom = values.startFrom || null;

    const variables = Object.fromEntries(
      values.variables.map((variable) => [variable, values.variablesValues[variable]])
    );

    onSubmit({ name: values.name, variables, startFrom });
  };

  const form = useFormik({
    onSubmit: onSubmitForm,
    initialValues,
    validationSchema: SCHEME,
    enableReinitialize: true,
  });

  const variablesList = React.useMemo(
    () => form.values.variables.map((variable) => ({ name: variable, value: form.values.variablesValues[variable] })),
    [form.values.variables, form.values.variablesValues]
  );

  return (
    <Box as="form" id="variable-state-form" fullWidth onSubmit={form.handleSubmit}>
      <Section header="Name" dividers forceDividers variant={SectionVariant.TERTIARY_TITLE}>
        <Input
          name="name"
          value={form.values.name}
          error={!!form.submitCount && !!form.errors.name}
          onChange={form.handleChange}
          disabled={form.isSubmitting}
          autoFocus
          placeholder="E.g., New User, Return User, Added Credit Card"
          onEnterPress={form.submitForm}
        />

        {!!form.submitCount && form.errors.name && <InputError>{form.errors.name}</InputError>}
      </Section>

      <Section header="Starting Block" dividers={false} variant={SectionVariant.TERTIARY_TITLE}>
        <BlockSelect
          value={form.values.startFrom}
          onChange={(startFrom) => form.setFieldValue('startFrom', startFrom)}
          disabled={form.isSubmitting}
          startNodeIsDefault
        />
      </Section>

      <Box pb={form.values.variables.length > 0 ? 16 : 32}>
        <Section header="Variables" dividers={false} variant={SectionVariant.TERTIARY_TITLE}>
          <VariablesSelect
            error={!!form.submitCount && !!form.errors.variables}
            value={form.values.variables}
            onChange={(value) => form.setFieldValue('variables', value)}
            disabled={form.isSubmitting}
            placeholder="Select variables to include"
          />

          {form.values.variables.length === 0 && (!form.errors.variables || form.submitCount === 0) && (
            <S.InputHint>Selected variables will be shown below to set value.</S.InputHint>
          )}

          {!!form.submitCount && form.errors.variables && <InputError>{form.errors.variables}</InputError>}
        </Section>
      </Box>

      {form.values.variables.length > 0 && (
        <Section customContentStyling={{ padding: 0 }} dividers isDividerNested variant={SectionVariant.TERTIARY}>
          <S.ListSection>
            <VariableList
              disabled={form.isSubmitting}
              canDelete
              variables={variablesList}
              onChangeList={(list) =>
                form.setValues((state) => ({
                  ...state,
                  variables: list.map(({ name }) => name),
                  variablesValues: list.reduce((acc, next) => ({ ...acc, [next.name]: next.value }), {}),
                }))
              }
            />
          </S.ListSection>
        </Section>
      )}
    </Box>
  );
};

export default Object.assign(Form, {
  FORM_ID,
});
