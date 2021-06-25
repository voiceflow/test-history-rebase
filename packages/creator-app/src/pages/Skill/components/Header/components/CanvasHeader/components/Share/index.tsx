import React from 'react';

import { SharePopperContext } from '../../../../contexts';
import SharePopper from '../../../SharePopper';
import { ShareButton } from './components';

const Share: React.FC = () => {
  const shareModal = React.useContext(SharePopperContext)!;

  return (
    <SharePopper>
      {({ ref, isOpened }) => (
        <ShareButton ref={ref} onClick={() => shareModal.open()} isActive={isOpened}>
          Share
        </ShareButton>
      )}
    </SharePopper>
  );
};

export default Share;
