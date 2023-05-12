import { Box, Button, Modal, ThemeColor } from '@voiceflow/ui';
import React from 'react';

import TextArea from '@/components/TextArea';
import { HTTPS_URL_REGEX } from '@/constants';
import manager from '@/ModalsV2/manager';

const MAX_ROWS = 25;
const PLACEHOLDER = `https://example.com/about`;

interface WebManagerProps {
  save: (urls: string[]) => void;
}

const WebManager = manager.create<WebManagerProps>('WebManager', () => ({ save, api, type, opened, hidden, animated, closePrevented }) => {
  const [urls, setUrls] = React.useState<string>('');
  const [errors, setErrors] = React.useState<string[]>([]);

  const validate = () => {
    // validate if urls are valid
    const urlList = urls.split('\n').filter((url) => !!url.trim());
    const errors = urlList.filter((url) => !HTTPS_URL_REGEX.test(url)).map((url) => `${url} is not a valid URL`);
    if (urlList.length > MAX_ROWS) errors.push(`Only ${MAX_ROWS} URLs are allowed`);

    setErrors(errors);
    return errors;
  };

  const onSave = () => {
    if (validate().length) return;

    // only save MAX_ROWS
    save(
      urls
        .split('\n')
        .filter((url) => !!url.trim())
        .slice(0, MAX_ROWS)
    );
    api.close();
  };

  const hasError = !!errors.length;

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header border actions={<Modal.Header.CloseButtonAction onClick={api.close} />}>
        Add URLs
      </Modal.Header>
      <Modal.Body mt={16}>
        <Box mb={11} fontWeight={600} color={ThemeColor.SECONDARY}>
          Add URLs (separate by line)
        </Box>
        <TextArea value={urls} onChangeText={setUrls} minRows={2} placeholder={PLACEHOLDER} onBlur={validate} error={hasError} />
        {hasError && (
          <Box color={ThemeColor.ERROR} mt={8}>
            {errors.map((error, index) => (
              <Box key={index}>{error}</Box>
            ))}
          </Box>
        )}
      </Modal.Body>
      <Modal.Footer gap={12}>
        <Button onClick={api.close} variant={Button.Variant.TERTIARY} disabled={closePrevented} squareRadius>
          Cancel
        </Button>
        <Button disabled={closePrevented || !urls || hasError} onClick={onSave}>
          Add URLs
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default WebManager;
