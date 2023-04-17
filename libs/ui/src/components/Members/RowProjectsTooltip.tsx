import Box from '@ui/components/Box';
import SvgIcon from '@ui/components/SvgIcon';
import TippyTooltip from '@ui/components/TippyTooltip';
import { UserRole } from '@voiceflow/internal';
import pluralize from 'pluralize';
import React from 'react';

import { Member } from './types';

interface RowProjectsTooltipProps {
  member: Member;
  isEditorRole: (role: UserRole) => boolean;
}

const RowProjectsTooltip: React.FC<RowProjectsTooltipProps> = ({ member, isEditorRole }) => {
  if (isEditorRole(member.role) || !member.projects?.length) return null;

  return (
    <TippyTooltip
      width={232}
      delay={[500, 0]}
      offset={[0, 8]}
      placement="bottom"
      interactive
      content={
        <TippyTooltip.Multiline>
          <TippyTooltip.Title>Can edit {pluralize('assistant', member.projects.length, true)}:</TippyTooltip.Title>

          <Box p="4px 0 8px 0">
            {member.projects.map((name, index) => (
              <div key={index}>○ {name}</div>
            ))}
          </Box>
        </TippyTooltip.Multiline>
      }
    >
      <SvgIcon icon="info" variant={SvgIcon.Variant.STANDARD} clickable />
    </TippyTooltip>
  );
};

export default RowProjectsTooltip;
