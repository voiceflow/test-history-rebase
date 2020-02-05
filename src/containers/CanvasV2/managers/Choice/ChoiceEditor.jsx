import React from 'react';

import ChoiceManager from './components/ChoiceManager';

function ChoiceEditor({ data, onChange, ...props }) {
  return <ChoiceManager data={data} onChange={onChange} {...props} />;
}

export default ChoiceEditor;
