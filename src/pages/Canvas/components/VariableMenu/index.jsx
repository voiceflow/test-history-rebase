import React from 'react';

import Panel, { Content as PanelContent } from '@/components/Panel';
import * as Realtime from '@/ducks/realtime';
import { activeDiagramIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { LockedResourceOverlay } from '@/pages/Canvas/components/LockedEditorOverlay';

import IntentCloud from './components/IntentCloud';
import SlotCloud from './components/SlotCloud';
import VariableCloud from './components/VariableCloud';
import VariableForm from './components/VariableForm';

const VariableMenu = ({ isHidden, onClose, activeDiagram }) => {
  return (
    <LockedResourceOverlay key={activeDiagram} type={Realtime.ResourceType.VARIABLES} disabled={isHidden}>
      {({ lockOwner, prevOwner }) => (
        <Panel title="Variables" onClose={onClose}>
          <PanelContent>
            <VariableForm lockOwner={lockOwner} prevOwner={prevOwner} />
            <VariableCloud />
            <SlotCloud />
            <IntentCloud />
          </PanelContent>
        </Panel>
      )}
    </LockedResourceOverlay>
  );
};

const mapStateToProps = {
  activeDiagram: activeDiagramIDSelector,
};

export default connect(mapStateToProps)(VariableMenu);
