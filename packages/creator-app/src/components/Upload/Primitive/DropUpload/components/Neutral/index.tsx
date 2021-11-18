import { Icon, swallowEvent } from '@voiceflow/ui';
import React from 'react';

import { CornerActionButton } from '..';
import BrowseButton from './components/BrowseButton';
import Message from './components/Message';

interface NeutralProps {
  onCornerAction?: VoidFunction;
  cornerIcon?: Icon;
  label?: string;
}

const Neutral: React.FC<NeutralProps> = ({ onCornerAction, cornerIcon, label = 'file' }) => (
  <>
    {onCornerAction && cornerIcon && <CornerActionButton onClick={swallowEvent(onCornerAction)} size={12} icon={cornerIcon} />}
    <Message>
      Drop {label} here or <BrowseButton>Browse</BrowseButton>
    </Message>
  </>
);

export default Neutral;
