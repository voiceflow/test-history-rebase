import { Utils } from '@voiceflow/common';
import type { Function as FunctionType } from '@voiceflow/dtos';
import { IconName } from '@voiceflow/icons';
import * as Realtime from '@voiceflow/realtime-sdk';
import { tid } from '@voiceflow/style';
import { Dropdown, Menu, notify, TextArea, Tooltip } from '@voiceflow/ui-next';
import { functionNameValidator } from '@voiceflow/utils-designer';
import React, { useState } from 'react';

import { CMSFormName } from '@/components/CMS/CMSForm/CMSFormName/CMSFormName.component';
import { Modal } from '@/components/Modal';
import { CMS_FUNCTION_DEFAULT_CODE } from '@/constants/cms/function.constant';
import { Designer } from '@/ducks';
import { useFeature } from '@/hooks';
import { useInputState } from '@/hooks/input.hook';
import { useDispatch } from '@/hooks/store.hook';
import { useValidators } from '@/hooks/validate.hook';

import { modalsManager } from '../../manager';
import { FunctionStarterTemplate, starterTemplates, TemplateID } from './FunctionCreate.constant';
import { dropdownModifier, dropdownPrefixIconModifier, textareaStyles } from './FunctionCreate.css';

export interface IFunctionCreateModal {
  name?: string;
  folderID: string | null;
}

export const FunctionCreateModal = modalsManager.create<IFunctionCreateModal, FunctionType>(
  'FunctionCreateModal',
  () =>
    ({ api, type: typeProp, name: nameProp, opened, hidden, animated, folderID, closePrevented }) => {
      const TEST_ID = 'create-function';

      const functionListen = useFeature(Realtime.FeatureFlag.FUNCTION_LISTEN);
      const filteredTemplates = functionListen.isEnabled
        ? starterTemplates
        : starterTemplates.filter((template) => ![TemplateID.LISTEN, TemplateID.LISTEN_WITH_CAROUSEL].includes(template.templateID));

      const createOne = useDispatch(Designer.Function.effect.createOne);
      const createOneFromTemplate = useDispatch(Designer.Function.effect.createOneFromTemplate);

      const [selectedTemplate, setSelectedTemplate] = useState<FunctionStarterTemplate | null>(null);
      const [description, setDescription] = useState('');
      const nameState = useInputState({ value: nameProp ?? '' });

      const validator = useValidators({
        name: [functionNameValidator, nameState.setError],
      });

      const onCreate = validator.container(async (fields) => {
        api.preventClose();

        try {
          const createdFunction =
            selectedTemplate === null
              ? await createOne({
                  ...fields,
                  code: CMS_FUNCTION_DEFAULT_CODE,
                  image: null,
                  folderID,
                  description,
                })
              : await createOneFromTemplate(selectedTemplate.templateID, nameState.value, description);

          api.resolve(createdFunction);
          api.enableClose();
          api.close();
        } catch (e) {
          notify.short.genericError();

          api.enableClose();
        }
      });

      const onSubmit = () => onCreate({ name: nameState.value });

      const onTemplateChange = (template: FunctionStarterTemplate) => {
        setSelectedTemplate(template);
        nameState.setValue(template.name);
        setDescription(template.description);
      };

      const onTemplateClear = () => {
        setSelectedTemplate(null);
        nameState.setValue('');
        setDescription('');
      };

      const hasSelectedTemplate = selectedTemplate !== null;
      const renderPrefixIconSettings = hasSelectedTemplate
        ? {
            prefixIconName: 'CloseS' as IconName,
            prefixIconClassName: dropdownPrefixIconModifier,
            className: dropdownModifier,
          }
        : {
            prefixIconName: undefined,
          };

      return (
        <Modal.Container
          type={typeProp}
          opened={opened}
          hidden={hidden}
          animated={animated}
          onExited={api.remove}
          onEscClose={api.onEscClose}
          onEnterSubmit={onSubmit}
          testID={TEST_ID}
        >
          <Modal.Header title="Create function" onClose={api.onClose} testID={tid(TEST_ID, 'header')} />
          <Modal.Body gap={16}>
            <div>
              <Dropdown
                value={hasSelectedTemplate ? selectedTemplate.name : selectedTemplate}
                label="Starter template"
                placeholder="Select template (optional)"
                {...renderPrefixIconSettings}
                onPrefixIconClick={() => onTemplateClear()}
                testID={tid(TEST_ID, 'starter-template-dropdown')}
              >
                {({ onClose }) => (
                  <Menu>
                    {filteredTemplates.map((template, index) => (
                      <Tooltip
                        key={template.templateID}
                        placement="right-start"
                        width={200}
                        referenceElement={({ popper, ref, onClose: onPopperClose, onOpen }) => (
                          <Menu.Item
                            ref={ref}
                            key={template.name}
                            label={template.name}
                            onMouseEnter={onOpen}
                            onMouseLeave={onPopperClose}
                            onClick={Utils.functional.chainVoid(onClose, () => onTemplateChange(filteredTemplates[index]))}
                            testID={tid(TEST_ID, 'menu-item')}
                          >
                            {popper}
                          </Menu.Item>
                        )}
                      >
                        {() => <Tooltip.Caption mb={0}>{template.description}</Tooltip.Caption>}
                      </Tooltip>
                    ))}
                  </Menu>
                )}
              </Dropdown>
            </div>

            <CMSFormName
              value={nameState.value}
              error={nameState.error}
              placeholder="Enter function name"
              onValueChange={nameState.setValue}
              testID={tid('function', 'name')}
            />

            <div>
              <TextArea
                label="Description"
                value={description}
                onValueChange={setDescription}
                disabled={closePrevented}
                className={textareaStyles}
                placeholder="Enter description (optional)"
                testID={tid('function', 'description')}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Footer.Button variant="secondary" onClick={api.onClose} disabled={closePrevented} label="Cancel" testID={tid(TEST_ID, 'cancel')} />

            <Modal.Footer.Button
              label="Create function"
              variant="primary"
              onClick={onSubmit}
              disabled={closePrevented}
              isLoading={closePrevented}
              testID={tid(TEST_ID, 'create')}
            />
          </Modal.Footer>
        </Modal.Container>
      );
    },
  { backdropDisabled: true }
);
