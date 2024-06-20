import { Box, Button, ButtonVariant, Modal } from '@voiceflow/ui';
import React from 'react';

import { supportGraphic } from '@/assets';
import Alert from '@/components/Alert';

import manager from '../manager';

const GENERIC_ERROR = 'Something went wrong - please refresh your page';

interface RawError {
  data?: unknown;
  message?: React.ReactNode;
  violations?: { message: React.ReactNode }[];
  [key: string]: unknown;
}

export interface Props {
  error?: unknown;
}

const Error = manager.create<Props>('Error', () => ({ api, type, opened, hidden, animated, error: propError }) => {
  let error = propError as RawError | null | string;

  if (!error) {
    error = GENERIC_ERROR;
  }

  if (typeof error === 'string') {
    error = { message: error };
  }

  if (!error.message && error.data) {
    error = { ...error, message: typeof error.data === 'string' ? error.data : JSON.stringify(error.data) };
  }

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={350}>
      <Modal.Body padding="16px !important" textAlign="center">
        <img src={supportGraphic} alt="Support" height={80} />

        {error.message ? (
          <>
            <Box my={20}>{error.message}</Box>

            {error.violations?.map((violation, i) => (
              <Alert key={i} variant={Alert.Variant.DANGER} mb={16}>
                {violation.message}
              </Alert>
            ))}
          </>
        ) : (
          <Alert variant={Alert.Variant.DANGER} mb={16}>
            {typeof error === 'string' ? error : JSON.stringify((error.error as any) ?? error)}
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant={ButtonVariant.TERTIARY} onClick={api.onClose}>
          Return
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Error;
