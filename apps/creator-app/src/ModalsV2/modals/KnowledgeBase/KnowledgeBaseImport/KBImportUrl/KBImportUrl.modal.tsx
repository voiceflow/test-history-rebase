import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, TextArea } from '@voiceflow/ui-next';
import pluralize from 'pluralize';
import React, { useMemo } from 'react';

import { Modal } from '@/components/Modal';
import { Permission } from '@/constants/permissions';
import { Designer } from '@/ducks';
import { useFeature } from '@/hooks/feature';
import { useInput, useInputState } from '@/hooks/input.hook';
import { usePermission } from '@/hooks/permission';
import { useDispatch } from '@/hooks/store.hook';
import { useValidators } from '@/hooks/validate.hook';
import manager from '@/ModalsV2/manager';

import { KBFieldLabel } from '../components/KBFieldLabel/KBFieldLabel.component';
import { KBRefreshRateSelect } from '../components/KBRefreshRateSelect/KBRefreshRateSelect.component';
import { sanitizeURLs, urlsValidator } from '../KnowledgeBaseImport.utils';
import { errorTextStyles, textareaStyles } from './KBImportUrl.css';

export const KBImportUrl = manager.create('KBImportURL', () => ({ api, type, opened, hidden, animated, closePrevented }) => {
  const { isEnabled: isRefreshEnabled } = useFeature(Realtime.FeatureFlag.KB_REFRESH);
  const createManyFromData = useDispatch(Designer.KnowledgeBase.Document.effect.createManyFromData);
  const [canSetRefreshRate] = usePermission(Permission.KB_REFRESH_RATE);

  const inputState = useInputState();
  const [refreshRate, setRefreshRate] = React.useState(BaseModels.Project.KnowledgeBaseDocumentRefreshRate.NEVER);

  const validator = useValidators({
    urls: [urlsValidator, inputState.setError],
  });

  const onCreate = validator.container(async ({ urls }) => {
    api.preventClose();

    await createManyFromData(
      sanitizeURLs(urls.split('\n')).map((url) => ({ url, name: url, type: BaseModels.Project.KnowledgeBaseDocumentType.URL, refreshRate }))
    );

    api.enableClose();
    api.close();
  });

  const onSubmit = () => {
    onCreate({ urls: inputState.value });
  };

  const input = useInput<string, HTMLTextAreaElement>({
    value: inputState.value,
    error: inputState.error,
    onSave: inputState.setValue,
  });

  const URLInputCaption = useMemo(() => {
    const inputVal = inputState.value;
    if (!inputVal.trim()) return 'One url per line.';

    return input.errorMessage || `${pluralize('URL', inputVal.split('\n').length - 1, true)} added.`;
  }, [inputState.value]);

  return (
    <Modal.Container
      type={type}
      opened={opened}
      hidden={hidden}
      animated={animated}
      onExited={api.remove}
      onEscClose={api.onEscClose}
      onEnterSubmit={onSubmit}
    >
      <Modal.Header title="Import from URL(s)" onClose={api.onClose} />

      <Box mt={20} mx={24} mb={24} direction="column" gap={16}>
        <Box direction="column" gap={6}>
          <KBFieldLabel>URL(s)</KBFieldLabel>
          <TextArea.AutoSize
            {...input.attributes}
            caption={URLInputCaption}
            disabled={closePrevented}
            autoFocus
            className={textareaStyles}
            placeholder="Enter URL(s)"
            captionClassName={errorTextStyles}
          />
        </Box>

        {isRefreshEnabled && (
          <KBRefreshRateSelect value={refreshRate} disabled={closePrevented || !canSetRefreshRate} onValueChange={setRefreshRate} />
        )}
      </Box>

      <Modal.Footer>
        <Modal.Footer.Button label="Cancel" variant="secondary" onClick={api.onClose} disabled={closePrevented} />

        <Modal.Footer.Button label="Import" onClick={onSubmit} disabled={closePrevented} isLoading={closePrevented} />
      </Modal.Footer>
    </Modal.Container>
  );
});
