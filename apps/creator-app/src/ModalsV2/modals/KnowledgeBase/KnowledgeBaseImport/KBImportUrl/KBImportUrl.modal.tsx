import { BaseModels } from '@voiceflow/base-types';
import { tid } from '@voiceflow/style';
import { Box, Scroll, TextArea } from '@voiceflow/ui-next';
import pluralize from 'pluralize';
import React, { useMemo } from 'react';

import { Modal } from '@/components/Modal';
import { LimitType } from '@/constants/limits';
import { Designer } from '@/ducks';
import { useInput, useInputState } from '@/hooks/input.hook';
import { usePlanLimitConfig } from '@/hooks/planLimitV2';
import { useDispatch } from '@/hooks/store.hook';
import { useValidators } from '@/hooks/validate.hook';
import manager from '@/ModalsV2/manager';

import { KBRefreshRateSelect } from '../components/KBRefreshRateSelect/KBRefreshRateSelect.component';
import { DEFAULT_DOCUMENT_LIMIT } from '../KnowledgeBaseImport.constant';
import { filterWhitespace, sanitizeURLsWithDataFormatting, urlsValidator, useDocumentLimitError } from '../KnowledgeBaseImport.utils';
import { textareaStyles } from './KBImportUrl.css';

export const KBImportUrl = manager.create(
  'KBImportURL',
  () =>
    ({ api, type, opened, hidden, animated, closePrevented }) => {
      const TEST_ID = tid('knowledge-base', 'import-url-modal');

      const checkDocumentLimitError = useDocumentLimitError(api.enableClose);
      const createManyFromData = useDispatch(Designer.KnowledgeBase.Document.effect.createManyFromData);
      const planConfig = usePlanLimitConfig(LimitType.KB_DOCUMENTS);

      const inputState = useInputState();
      const [refreshRate, setRefreshRate] = React.useState(BaseModels.Project.KnowledgeBaseDocumentRefreshRate.NEVER);

      const validator = useValidators({
        urls: [urlsValidator, inputState.setError],
      });

      const onCreate = validator.container(
        async ({ urls }) => {
          api.preventClose();

          const data = sanitizeURLsWithDataFormatting(urls, refreshRate);

          try {
            await createManyFromData(data);
            api.enableClose();
            api.onClose();
          } catch (error) {
            checkDocumentLimitError(error);
          }
        },
        () => ({
          limit: planConfig?.limit || DEFAULT_DOCUMENT_LIMIT,
        })
      );

      const onSave = (value: string) => {
        inputState.setValue(value);

        const validate = validator.container(
          () => {},
          () => ({
            limit: planConfig?.limit || DEFAULT_DOCUMENT_LIMIT,
          })
        );
        validate({ urls: value });
      };

      const onSubmit = () => {
        onCreate({ urls: filterWhitespace(inputState.value) });
      };

      const input = useInput<string, HTMLTextAreaElement>({
        value: inputState.value,
        error: inputState.error,
        onSave,
      });

      const caption = useMemo(() => {
        const inputVal = inputState.value;

        if (!inputVal.trim()) return 'One url per line.';

        return `${pluralize('URL', filterWhitespace(inputVal).split('\n').length, true)} added.`;
      }, [inputState.value, inputState.error]);

      return (
        <Modal.Container
          type={type}
          opened={opened}
          hidden={hidden}
          animated={animated}
          onExited={api.remove}
          onEscClose={api.onEscClose}
          onEnterSubmit={onSubmit}
          testID={TEST_ID}
        >
          <Modal.Header title="Import from URL(s)" onClose={api.onClose} testID={tid(TEST_ID, 'header')} />

          <Scroll style={{ display: 'block' }}>
            <Box mt={20} mb={24} direction="column" gap={16} width="100%">
              <Box direction="column">
                <Box direction="column" mx={24} grow={1}>
                  <TextArea.AutoSize
                    {...input.attributes}
                    label="URL(s)"
                    caption={input.errored ? undefined : caption}
                    errorMessage={input.errorMessage}
                    disabled={closePrevented}
                    autoFocus
                    className={textareaStyles}
                    placeholder="Enter URL(s)"
                    horizontalScroll
                    testID={tid(TEST_ID, 'urls')}
                  />
                </Box>
              </Box>

              <Box mx={24}>
                <KBRefreshRateSelect
                  value={refreshRate}
                  disabled={closePrevented}
                  onValueChange={setRefreshRate}
                  testID={tid(TEST_ID, 'refresh-rate')}
                />
              </Box>
            </Box>
          </Scroll>

          <Modal.Footer>
            <Modal.Footer.Button label="Cancel" variant="secondary" onClick={api.onClose} disabled={closePrevented} testID={tid(TEST_ID, 'cancel')} />

            <Modal.Footer.Button
              label="Import"
              onClick={onSubmit}
              disabled={closePrevented}
              isLoading={closePrevented}
              testID={tid(TEST_ID, 'import')}
            />
          </Modal.Footer>
        </Modal.Container>
      );
    },
  { backdropDisabled: true }
);
