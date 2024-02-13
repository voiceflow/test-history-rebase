import type { Variable as VariableType } from '@voiceflow/dtos';
import { VariableDatatype } from '@voiceflow/dtos';
import { Divider, notify, Scroll, Tokens, Variable } from '@voiceflow/ui-next';
import { variableNameValidator } from '@voiceflow/utils-designer';
import React, { useState } from 'react';

import { CMSFormName } from '@/components/CMS/CMSForm/CMSFormName/CMSFormName.component';
import { Modal } from '@/components/Modal';
import { VariableColorSection } from '@/components/Variable/VariableColorSection/VariableColorSection.component';
import { VariableDefaultValueSection } from '@/components/Variable/VariableDefaultValueSection/VariableDefaultValueSection.component';
import { VariableDescriptionInput } from '@/components/Variable/VariableDescriptionInput/VariableDescriptionInput.component';
import { Designer } from '@/ducks';
import { useInputState } from '@/hooks/input.hook';
import { useDispatch, useGetValueSelector } from '@/hooks/store.hook';
import { useValidators } from '@/hooks/validate.hook';
import { transformVariableName } from '@/utils/variable.util';

import { modalsManager } from '../../manager';

export interface IVariableCreateModal {
  name?: string;
  folderID: string | null;
}

export const VariableCreateModal = modalsManager.create<IVariableCreateModal, VariableType>(
  'VariableCreateModal',
  () =>
    ({ api, type: typeProp, name: nameProp, opened, hidden, animated, folderID, closePrevented }) => {
      const getIntents = useGetValueSelector(Designer.Intent.selectors.allWithFormattedBuiltInNames);
      const getEntities = useGetValueSelector(Designer.Entity.selectors.all);
      const getVariables = useGetValueSelector(Designer.Variable.selectors.all);

      const createOne = useDispatch(Designer.Variable.effect.createOne);

      const nameState = useInputState({ value: nameProp ?? '' });
      const [color, setColor] = useState(Tokens.colors.neutralDark.neutralsDark200);
      const [datatype] = useState<VariableDatatype>(VariableDatatype.ANY);
      const [description, setDescription] = useState<string | null>(null);
      const [defaultValue, setDefaultValue] = useState<string | null>(null);

      const validator = useValidators({
        name: [variableNameValidator, nameState.setError],
      });

      const onCreate = validator.container(
        async ({ name }) => {
          api.preventClose();

          try {
            const variable = await createOne({
              name,
              color,
              isArray: false,
              datatype,
              folderID,
              description: description?.trim() || '',
              defaultValue,
            });

            api.resolve(variable);
            api.enableClose();
            api.close();
          } catch (e) {
            notify.short.genericError();

            api.enableClose();
          }
        },
        () => ({
          intents: getIntents(),
          entities: getEntities(),
          variables: getVariables(),
          variableID: null,
        })
      );

      const onSubmit = () => onCreate({ name: nameState.value });

      api.useOnCloseRequest((source) => source !== 'backdrop');

      return (
        <Modal.Container
          type={typeProp}
          opened={opened}
          hidden={hidden}
          animated={animated}
          onExited={api.remove}
          onEscClose={api.onEscClose}
          onEnterSubmit={onSubmit}
        >
          <Modal.Header title="Create variable" onClose={api.onClose} />

          <Scroll style={{ display: 'block' }}>
            <Modal.Body gap={16}>
              <CMSFormName
                value={nameState.value}
                error={nameState.error}
                disabled={closePrevented}
                autoFocus
                transform={transformVariableName}
                placeholder="Enter variable name"
                onValueChange={nameState.setValue}
                rightLabel={nameState.value ? <Variable label={nameState.value} color={color} /> : undefined}
              />

              <VariableDescriptionInput value={description} disabled={closePrevented} onValueChange={setDescription} />

              <VariableColorSection color={color} disabled={closePrevented} onColorChange={setColor} />
            </Modal.Body>

            <Divider fullWidth noPadding />

            <VariableDefaultValueSection value={defaultValue} disabled={closePrevented} onValueChange={setDefaultValue} />
          </Scroll>

          <Modal.Footer>
            <Modal.Footer.Button variant="secondary" onClick={api.onClose} disabled={closePrevented} label="Cancel" />

            <Modal.Footer.Button label="Create variable" variant="primary" onClick={onSubmit} disabled={closePrevented} isLoading={closePrevented} />
          </Modal.Footer>
        </Modal.Container>
      );
    }
);
