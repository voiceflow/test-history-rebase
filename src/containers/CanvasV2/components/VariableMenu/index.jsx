import React from 'react';

import Panel, { Content as PanelContent } from '@/components/Panel';
import { LockedResourceOverlay } from '@/containers/CanvasV2/components/LockedEditorOverlay';
import * as Realtime from '@/ducks/realtime';
import { activeDiagramIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';

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
