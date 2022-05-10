import React from 'react';

import LinkArrowIcon from './LinkArrowIcon';
import SimpleSection from './SimpleSection';

export interface LinkSectionProps {
  onClick: VoidFunction;
}

const LinkSection: React.FC<LinkSectionProps> = ({ onClick, children }) => (
  <SimpleSection isLink onClick={onClick}>
    {children}

    <LinkArrowIcon />
  </SimpleSection>
);

export default LinkSection;
