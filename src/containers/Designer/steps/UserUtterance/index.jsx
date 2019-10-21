import React from 'react';

import UtteranceStep from '@/containers/Designer/components/UtteranceStep';

const UserUtterance = ({ value }) => (
  <UtteranceStep icon="user" color="#5589EB">
    {value}
  </UtteranceStep>
);

export default UserUtterance;
