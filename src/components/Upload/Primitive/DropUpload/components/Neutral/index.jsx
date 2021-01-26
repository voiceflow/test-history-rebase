import React from 'react';

import { swallowEvent } from '@/utils/dom';

import { CornerActionButton } from '..';
import BrowseButton from './components/BrowseButton';
import Message from './components/Message';

const Neutral = ({ onCornerAction, cornerIcon, label }) => (
  <>
    {onCornerAction && cornerIcon && <CornerActionButton onClick={swallowEvent(onCornerAction)} size={12} icon={cornerIcon} />}
    <Message>
      Drop {label} here or <BrowseButton>Browse</BrowseButton>
    </Message>
  </>
);

export default Neutral;
