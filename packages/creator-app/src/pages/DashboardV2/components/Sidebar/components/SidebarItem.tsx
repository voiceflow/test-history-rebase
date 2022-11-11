import { Box, Link, SvgIcon, SvgIconTypes, Text } from '@voiceflow/ui';
import React from 'react';

import { SidebarItemContainer } from '../styles';

interface SidebarItemProps {
  icon: SvgIconTypes.Icon;
  label: string;
  detail?: string;
  active?: boolean;
  link?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, detail, active, link }) => {
  return (
    <SidebarItemContainer active={active}>
      <Box.Flex>
        <SvgIcon icon={icon} color={active ? 'rgb(19, 33, 68)' : 'rgba(110, 132, 154, 0.85)'} />
        <Text pl={12}>{label}</Text>
      </Box.Flex>
      {detail && <Text color="rgba(110, 132, 154, 0.85)">{detail}</Text>}
      {link && (
        <Link link={link}>
          <SvgIcon icon="editorURL" color="rgba(110, 132, 154, 0.85)" />
        </Link>
      )}
    </SidebarItemContainer>
  );
};

export default SidebarItem;
