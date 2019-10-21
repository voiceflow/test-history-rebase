import React from 'react';

import Textarea from '@/componentsV2/TextArea';

const SlotSynonymControl = ({ value, placeholder, onChange, ...props }) => (
  <Textarea value={value} onChange={({ target }) => onChange(target.value)} placeholder={placeholder || 'Enter Slot Content Example'} {...props} />
);

export default SlotSynonymControl;
