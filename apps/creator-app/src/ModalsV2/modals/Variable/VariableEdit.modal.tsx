import { Divider, Scroll, Text, toast, Tooltip, useTooltipModifiers, Variable } from '@voiceflow/ui-next';
import React from 'react';

import { CMSFormName } from '@/components/CMS/CMSForm/CMSFormName/CMSFormName.component';
import { Modal } from '@/components/Modal';
import { VariableColorSection } from '@/components/Variable/VariableColorSection/VariableColorSection.component';
import { VariableDefaultValueSection } from '@/components/Variable/VariableDefaultValueSection/VariableDefaultValueSection.component';
import { VariableDescriptionInput } from '@/components/Variable/VariableDescriptionInput/VariableDescriptionInput.component';
import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { transformVariableName } from '@/utils/variable.util';

import { modalsManager } from '../../manager';

export interface IVariableEditModal {
  variableID: string;
}

export const VariableEditModal = modalsManager.create<IVariableEditModal>(
  'VariableEditModal',
  () =>
    ({ api, type, opened, hidden, animated, variableID }) => {
      const variable = useSelector(Designer.Variable.selectors.oneByID, { id: variableID });
      const variables = useSelector(Designer.Variable.selectors.all);

      const patchVariable = useDispatch(Designer.Variable.effect.patchOne, variableID);
      const deleteVariable = useDispatch(Designer.Variable.effect.deleteOne, variableID);

      const onVariableSelect = (id: string) => {
        api.updateProps({ variableID: id }, { reopen: true });
      };

      const onNameChange = (name: string) => {
        if (!name) return;

        patchVariable({ name });
      };

      const onEntityDelete = async () => {
        api.close();

        await deleteVariable();

        toast.info('Deleted', { showIcon: false });
      };

      const tooltipModifiers = useTooltipModifiers([{ name: 'offset', options: { offset: [0, 27] } }]);

      return (
        <Modal.Container type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} onEscClose={api.onEscClose}>
          <Modal.Header
            title="Edit variable"
            onClose={api.onClose}
            leftButton={<Modal.HeaderMenu items={variables} activeID={variableID} onSelect={onVariableSelect} notFoundLabel="variables" />}
            secondaryButton={<Modal.HeaderMore options={[{ name: 'Delete', onClick: onEntityDelete, disabled: variable?.isSystem }]} />}
          />

          <>
            {variable ? (
              <Scroll style={{ display: 'block' }}>
                <Modal.Body gap={16}>
                  <Tooltip
                    placement="left"
                    modifiers={tooltipModifiers}
                    referenceElement={({ ref, onOpen, onClose }) => (
                      <CMSFormName
                        value={variable.name}
                        disabled={variable.isSystem}
                        transform={transformVariableName}
                        autoFocus
                        placeholder="Enter variable name"
                        containerRef={ref}
                        onValueChange={onNameChange}
                        rightLabel={<Variable label={variable.name} color={variable.color} />}
                        onPointerEnter={variable.isSystem ? onOpen : undefined}
                        onPointerLeave={onClose}
                      />
                    )}
                  >
                    {() => (
                      <Text variant="caption">
                        Name can’t be modified
                        <br /> for built-in variables.
                      </Text>
                    )}
                  </Tooltip>

                  <VariableDescriptionInput value={variable.description} onValueChange={(description) => patchVariable({ description })} />

                  <VariableColorSection color={variable.color} onColorChange={(color) => patchVariable({ color })} />
                </Modal.Body>

                <Divider noPadding />

                <VariableDefaultValueSection value={variable.defaultValue} onValueChange={(defaultValue) => patchVariable({ defaultValue })} />
              </Scroll>
            ) : (
              <Modal.Body>Variable not found</Modal.Body>
            )}
          </>

          <Modal.Footer>
            <Modal.Footer.Button label="Close" variant="secondary" onClick={api.onClose} />
          </Modal.Footer>
        </Modal.Container>
      );
    }
);
