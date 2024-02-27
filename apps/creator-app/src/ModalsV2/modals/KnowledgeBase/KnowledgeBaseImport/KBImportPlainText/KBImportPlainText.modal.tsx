import { tid } from '@voiceflow/style';
import { Box, notify, Scroll, TextArea } from '@voiceflow/ui-next';
import { Tokens } from '@voiceflow/ui-next/styles';
import { validatorFactory } from '@voiceflow/utils-designer';
import React from 'react';

import { Modal } from '@/components/Modal';
import { LimitType } from '@/constants/limits';
import { Designer } from '@/ducks';
import { useInput, useInputState } from '@/hooks/input.hook';
import { useUpgradeModal } from '@/hooks/modal.hook';
import { usePlanLimitConfig } from '@/hooks/planLimitV2';
import { useDispatch } from '@/hooks/store.hook';
import { useValidators } from '@/hooks/validate.hook';
import manager from '@/ModalsV2/manager';

import { KBFieldLabel } from '../components/KBFieldLabel/KBFieldLabel.component';
import { submitButtonStyles, textareaStyles } from './KBImportPlainText.css';

export const KBImportPlainText = manager.create('KBImportPlainText', () => ({ api, type, opened, hidden, animated, closePrevented }) => {
  const TEST_ID = tid('knowledge-base', 'import-plain-text-modal');

  const textState = useInputState();

  const planConfig = usePlanLimitConfig(LimitType.KB_DOCUMENTS, { limit: 5000 });
  const upgradeModal = useUpgradeModal();

  const createManyFromText = useDispatch(Designer.KnowledgeBase.Document.effect.createManyFromText);

  const validator = useValidators({
    text: [validatorFactory((text: string) => text.trim(), 'Text is required.'), textState.setError],
  });

  const onCreate = validator.container(async ({ text }) => {
    api.preventClose();

    await createManyFromText([text])
      .then(() => {
        api.enableClose();
        api.close();
        return null;
      })
      .catch((error) => {
        if (error.response.status === 406 && planConfig) {
          const limit = error.response.data.kbDocsLimit;
          notify.long.warning(`Document limit (${limit}) reached for your current subscription. Please upgrade to continue.`, {
            actionButtonProps: { label: 'Upgrade', onClick: () => upgradeModal.openVoid(planConfig.upgradeModal({ limit })) },
            bodyStyle: {
              color: Tokens.colors.neutralDark.neutralsDark900,
              fontSize: Tokens.typography.size[14],
              lineHeight: Tokens.typography.lineHeight[20],
              fontFamily: Tokens.typography.family.regular,
            },
          });
        } else {
          notify.short.error('Failed to import data sources');
        }
        api.enableClose();
      });
  });

  const input = useInput<string, HTMLTextAreaElement>({
    error: textState.error,
    value: textState.value,
    onSave: textState.setValue,
    onChangeValue: textState.setValue,

    autoFocus: true,
    allowEmpty: false,
  });

  const onSubmit = () => onCreate({ text: textState.value });

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
      <Modal.Header title="Import text" onClose={api.onClose} testID={tid(TEST_ID, 'header')} />

      <Scroll style={{ display: 'block' }}>
        <Box mt={20} mx={24} mb={24} direction="column" gap={6}>
          <KBFieldLabel>Content</KBFieldLabel>

          <TextArea.AutoSize
            {...input.attributes}
            disabled={closePrevented}
            caption={input.errorMessage ?? undefined}
            className={textareaStyles}
            placeholder="Enter or paste text here..."
            testID={tid(TEST_ID, 'content')}
          />
        </Box>
      </Scroll>

      <Modal.Footer>
        <Modal.Footer.Button label="Cancel" variant="secondary" onClick={api.onClose} disabled={closePrevented} testID={tid(TEST_ID, 'cancel')} />

        <Modal.Footer.Button
          className={submitButtonStyles}
          label={closePrevented ? '' : 'Import'}
          onClick={onSubmit}
          disabled={closePrevented}
          isLoading={closePrevented}
          testID={tid(TEST_ID, 'import')}
        />
      </Modal.Footer>
    </Modal.Container>
  );
});
