import React from 'react';

import LinkArrowIcon from './LinkArrowIcon';
import SimpleSection from './SimpleSection';

export interface LinkSectionProps extends React.PropsWithChildren {
  onClick: VoidFunction;
  onContextMenu?: React.MouseEventHandler;
}

const LinkSection: React.FC<LinkSectionProps> = ({ onClick, children, onContextMenu }) => (
  <SimpleSection isLink onClick={onClick} onContextMenu={onContextMenu}>
    {children}

    <LinkArrowIcon />
  </SimpleSection>
);

export default LinkSection;
