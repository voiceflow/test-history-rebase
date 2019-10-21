import React from 'react';

import UtteranceStep from '@/containers/Designer/components/UtteranceStep';

const SystemUtterance = ({ value }) => (
  <UtteranceStep icon="alexa" isReorderable>
    {value}
  </UtteranceStep>
);

export default SystemUtterance;
