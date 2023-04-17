import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { PopperTypes, SectionV2 } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import React from 'react';

import AddDropdown from './AddDropdown';

interface HeaderProps {
  entities: Realtime.Slot[];
  boldTitle?: boolean;
  onAddRequired: (slotID: string) => void;
  intentEntities: Normal.Normalized<Platform.Base.Models.Intent.Slot>;
  addDropdownPlacement?: PopperTypes.Placement;
}

const Header: React.FC<HeaderProps> = ({ entities, boldTitle, onAddRequired, intentEntities, addDropdownPlacement }) => (
  <SectionV2.Header>
    <SectionV2.Title bold={!!boldTitle}>Required entities</SectionV2.Title>

    <SectionV2.ActionsContainer unit={0}>
      <AddDropdown entities={entities} placement={addDropdownPlacement} intentEntities={intentEntities} onAddRequired={onAddRequired} />
    </SectionV2.ActionsContainer>
  </SectionV2.Header>
);

export default Header;
