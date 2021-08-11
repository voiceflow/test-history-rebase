import React from 'react';

import * as Workspace from '@/ducks/workspace';
import { useSelector } from '@/hooks';
import { Identifier } from '@/styles/constants';

import { SharePopperContext } from '../../../../contexts';
import SharePopper from '../../../SharePopper';
import { ShareButton } from './components';

const Share: React.FC = () => {
  const shareModal = React.useContext(SharePopperContext)!;
  const isTemplateWorkspace = useSelector(Workspace.isTemplateWorkspaceSelector);

  return (
    <SharePopper>
      {({ ref, isOpened }) => (
        <ShareButton id={Identifier.SHARE_BUTTON} ref={ref} onClick={() => shareModal.open()} isActive={isOpened}>
          {isTemplateWorkspace ? 'Download' : 'Share'}
        </ShareButton>
      )}
    </SharePopper>
  );
};

export default Share;
