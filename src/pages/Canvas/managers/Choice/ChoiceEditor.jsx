import React from 'react';

import ChoiceManager from './components/ChoiceManager';

const ChoiceEditor = ({ data, onChange, ...props }) => <ChoiceManager data={data} onChange={onChange} {...props} />;

export default ChoiceEditor;
