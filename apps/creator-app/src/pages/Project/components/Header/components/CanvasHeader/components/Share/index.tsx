import React from 'react';

import { Identifier } from '@/styles/constants';

import { SharePopperContext } from '../../../../contexts';
import SharePopper from '../../../SharePopper';
import { ShareButton } from './components';

const Share: React.FC = () => {
  const sharePopper = React.useContext(SharePopperContext)!;

  return (
    <SharePopper>
      {({ ref, isOpened }) => (
        <ShareButton id={Identifier.SHARE_BUTTON} ref={ref} onClick={() => sharePopper.open()} isActive={isOpened}>
          Share
        </ShareButton>
      )}
    </SharePopper>
  );
};

export default Share;
