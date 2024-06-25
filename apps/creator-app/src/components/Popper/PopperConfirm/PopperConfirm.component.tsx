import { Utils } from '@voiceflow/common';
import { tid } from '@voiceflow/style';
import { Box, Button, Popper, Surface, Text } from '@voiceflow/ui-next';
import React from 'react';

import type { IPopperConfirm } from './PopperConfirm.interface';

export const PopperConfirm = <Modifiers,>({
  testID,
  onCancel,
  children = 'This action can’t be undone, please confirm you’d like to continue.',
  placement = 'bottom-start',
  onConfirm,
  cancelLabel = 'No',
  confirmLabel = 'Yes',
  ...props
}: IPopperConfirm<Modifiers>) => (
  <Popper placement={placement} {...props}>
    {({ onClose }) => (
      <Surface width={238} px={20} py={16} gap={10} testID={tid(testID, 'confirmation')} direction="column">
        {typeof children === 'string' ? <Text>{children}</Text> : children}

        <Box gap={8}>
          <Button
            size="medium"
            label={cancelLabel}
            testID={tid(testID, ['confirmation', 'no'])}
            onClick={Utils.functional.chainVoid(onClose, onCancel)}
            variant="secondary"
            fullWidth
          />
          <Button
            size="medium"
            label={confirmLabel}
            testID={tid(testID, ['confirmation', 'yes'])}
            onClick={Utils.functional.chainVoid(onClose, onConfirm)}
            variant="primary"
            fullWidth
          />
        </Box>
      </Surface>
    )}
  </Popper>
);
