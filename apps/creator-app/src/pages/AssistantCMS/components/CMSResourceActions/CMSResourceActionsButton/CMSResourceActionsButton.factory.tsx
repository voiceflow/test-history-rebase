import React from 'react';

import { CMSResourceActionsButton } from './CMSResourceActionsButton.component';
import type { ICMSResourceActionsButton } from './CMSResourceActionsButton.interface';

export const cmsResourceActionsButtonFactory =
  (
    staticProps: Pick<ICMSResourceActionsButton, 'label' | 'iconName'>
  ): React.FC<Omit<ICMSResourceActionsButton, 'label' | 'iconName'>> =>
  (props) => <CMSResourceActionsButton {...props} {...staticProps} />;
