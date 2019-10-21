import React from 'react';

import Panel, { Content as PanelContent } from '@/components/Panel';

import VariableCloud from './components/VariableCloud';
import VariableForm from './components/VariableForm';

function VariableMenu({ onClose }) {
  return (
    <Panel title="Variables" onClose={onClose}>
      <PanelContent>
        <VariableForm />
        <VariableCloud />
      </PanelContent>
    </Panel>
  );
}

export default VariableMenu;
