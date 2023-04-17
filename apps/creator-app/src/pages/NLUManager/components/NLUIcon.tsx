import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

interface NLUIconProps extends React.ComponentProps<typeof SvgIcon> {
  isActive?: boolean;
}

const NLUIcon: React.FC<NLUIconProps> = ({ isActive, ...props }) => {
  return <SvgIcon {...props} color={isActive ? '#132144' : SvgIcon.DEFAULT_COLOR} clickable />;
};

export default NLUIcon;
