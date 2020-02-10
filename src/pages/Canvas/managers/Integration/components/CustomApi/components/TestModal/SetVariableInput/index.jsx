import React from 'react';

import PrefixInput from '@/components/PrefixInput';

function SetVariableInput({ prefix, onChange }) {
  return <PrefixInput prefix={prefix} onChange={onChange} />;
}

export default SetVariableInput;
