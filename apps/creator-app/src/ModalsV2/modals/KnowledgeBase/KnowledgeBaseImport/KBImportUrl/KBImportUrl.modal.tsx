import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { tid } from '@voiceflow/style';
import { Box, notify, Scroll, TextArea } from '@voiceflow/ui-next';
import { Tokens } from '@voiceflow/ui-next/styles';
import pluralize from 'pluralize';
import React, { useMemo } from 'react';

import { Modal } from '@/components/Modal';
import { LimitType } from '@/constants/limits';
import { Designer } from '@/ducks';
import { useFeature } from '@/hooks/feature';
import { useInput, useInputState } from '@/hooks/input.hook';
import { useUpgradeModal } from '@/hooks/modal.hook';
import { usePlanLimitConfig } from '@/hooks/planLimitV2';
import { useDispatch } from '@/hooks/store.hook';
import { useValidators } from '@/hooks/validate.hook';
import manager from '@/ModalsV2/manager';

import { KBFieldLabel } from '../components/KBFieldLabel/KBFieldLabel.component';
import { KBRefreshRateSelect } from '../components/KBRefreshRateSelect/KBRefreshRateSelect.component';
import { filterWhitespace, sanitizeURLs, urlsValidator } from '../KnowledgeBaseImport.utils';
import { errorTextStyles, textareaStyles } from './KBImportUrl.css';

export const KBImportUrl = manager.create('KBImportURL', () => ({ api, type, opened, hidden, animated, closePrevented }) => {
  const TEST_ID = tid('knowledge-base', 'import-url-modal');

  const { isEnabled: isRefreshEnabled } = useFeature(Realtime.FeatureFlag.KB_REFRESH);
  const planConfig = usePlanLimitConfig(LimitType.KB_DOCUMENTS, { limit: 5000 });
  const upgradeModal = useUpgradeModal();
  const createManyFromData = useDispatch(Designer.KnowledgeBase.Document.effect.createManyFromData);

  const inputState = useInputState();
  const [refreshRate, setRefreshRate] = React.useState(BaseModels.Project.KnowledgeBaseDocumentRefreshRate.NEVER);

  const validator = useValidators({
    urls: [urlsValidator, inputState.setError],
  });

  const onCreate = validator.container(async ({ urls }) => {
    api.preventClose();

    await createManyFromData(
      sanitizeURLs(urls.split('\n')).map((url) => ({ url, name: url, type: BaseModels.Project.KnowledgeBaseDocumentType.URL, refreshRate }))
    )
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

  const onSave = (value: string) => {
    inputState.setValue(value);

    const validate = validator.container(() => {});
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

  const URLInputCaption = useMemo(() => {
    const inputVal = inputState.value;

    if (input.errorMessage) return input.errorMessage;

    if (!inputVal.trim()) return 'One url per line.';

    return input.errorMessage || `${pluralize('URL', filterWhitespace(inputVal).split('\n').length, true)} added.`;
  }, [inputState.value, inputState.error, input.errorMessage]);

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
            <Box direction="column" mx={24} gap={6} grow={1}>
              <KBFieldLabel>URL(s)</KBFieldLabel>
              <TextArea.AutoSize
                {...input.attributes}
                caption={URLInputCaption}
                disabled={closePrevented}
                autoFocus
                className={textareaStyles}
                placeholder="Enter URL(s)"
                captionClassName={errorTextStyles}
                horizontalScroll
                testID={tid(TEST_ID, 'urls')}
              />
            </Box>
          </Box>

          <Box mx={24}>
            {isRefreshEnabled && (
              <KBRefreshRateSelect
                value={refreshRate}
                disabled={closePrevented}
                onValueChange={setRefreshRate}
                testID={tid(TEST_ID, 'refresh-rate')}
              />
            )}
          </Box>
        </Box>
      </Scroll>

      <Modal.Footer>
        <Modal.Footer.Button label="Cancel" variant="secondary" onClick={api.onClose} disabled={closePrevented} testID={tid(TEST_ID, 'cancel')} />

        <Modal.Footer.Button label="Import" onClick={onSubmit} disabled={closePrevented} isLoading={closePrevented} testID={tid(TEST_ID, 'import')} />
      </Modal.Footer>
    </Modal.Container>
  );
});
