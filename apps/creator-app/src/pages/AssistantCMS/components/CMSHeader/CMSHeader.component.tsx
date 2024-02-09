import { Header } from '@voiceflow/ui-next';
import React from 'react';

import { HEADER_TEST_ID } from '../../AssistantCMS.constant';
import { headerStyles } from './CMSHeader.css';
import type { ICMSHeader } from './CMSHeader.interface';
import { CMSHeaderMembers } from './CMSHeaderMembers/CMSHeaderMembers.component';
import { CMSHeaderSearch } from './CMSHeaderSearch/CMSHeaderSearch.component';
import { CMSHeaderShare } from './CMSHeaderShare/CMSHeaderShare.component';

export const CMSHeader: React.FC<ICMSHeader> = ({ rightActions, searchPlaceholder, hideShare, hideMembers }) => (
  <Header variant="search" className={headerStyles} testID={HEADER_TEST_ID}>
    <Header.Section.Left>
      <CMSHeaderSearch placeholder={searchPlaceholder} />
    </Header.Section.Left>

    <Header.Section.Right>
      {!hideMembers && <CMSHeaderMembers />}

      <Header.Section.RightActions>
        {!hideShare && <CMSHeaderShare />}
        {rightActions}
      </Header.Section.RightActions>
    </Header.Section.Right>
  </Header>
);
