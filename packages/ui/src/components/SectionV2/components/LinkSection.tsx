import React from 'react';

import LinkArrowIcon from './LinkArrowIcon';
import SimpleSection from './SimpleSection';

export interface LinkSectionProps {
  onClick: VoidFunction;
  onContextMenu?: React.MouseEventHandler;
}

const LinkSection: React.OldFC<LinkSectionProps> = ({ onClick, children, onContextMenu }) => (
  <SimpleSection isLink onClick={onClick} onContextMenu={onContextMenu}>
    {children}

    <LinkArrowIcon />
  </SimpleSection>
);

export default LinkSection;
