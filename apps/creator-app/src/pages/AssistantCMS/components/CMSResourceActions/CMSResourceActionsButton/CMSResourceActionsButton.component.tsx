import { Button } from '@voiceflow/ui-next';
import React from 'react';

import type { ICMSResourceActionsButton } from './CMSResourceActionsButton.interface';

export const CMSResourceActionsButton: React.FC<ICMSResourceActionsButton> = (props) => <Button {...props} size="medium" variant="secondary" />;
