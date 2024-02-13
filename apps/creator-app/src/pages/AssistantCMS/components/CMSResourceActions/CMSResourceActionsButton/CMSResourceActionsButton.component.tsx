import { Button, forwardRef } from '@voiceflow/ui-next';
import React from 'react';

import type { ICMSResourceActionsButton } from './CMSResourceActionsButton.interface';

export const CMSResourceActionsButton = forwardRef<HTMLButtonElement, ICMSResourceActionsButton>('CMSResourceActionsButton')((props, ref) => (
  <Button {...props} ref={ref} size="medium" variant="secondary" />
));
