import { Link, SidebarEditor } from '@voiceflow/ui';
import React from 'react';

import Tutorial from '../Tutorial';
import * as T from './types';

export * as DefaultFooterTypes from './types';

const DefaultFooter: React.FC<T.Props> = ({ tutorial, children }) => (
  <SidebarEditor.Footer>
    {(tutorial &&
      (typeof tutorial === 'string' ? <Link href={tutorial}>How it works?</Link> : <Tutorial {...tutorial}>{tutorial.content}</Tutorial>)) || <div />}

    {children ? <SidebarEditor.FooterActionsContainer>{children}</SidebarEditor.FooterActionsContainer> : null}
  </SidebarEditor.Footer>
);

export default DefaultFooter;
