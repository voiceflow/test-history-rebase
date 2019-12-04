import React from 'react';

import SvgIcon, { SvgIconContainer } from '@/components/SvgIcon';
import { User } from '@/components/User/User';
import { FlexEnd } from '@/componentsV2/Flex';
import { styled, units } from '@/hocs';

const CombinedBlockHandle = ({ icon, color, lockOwner, className }, ref) => (
  <FlexEnd className={className} ref={ref}>
    {lockOwner && <User user={lockOwner} className="avatar" />}
    <SvgIcon icon={icon} color={color} className="drag-handle__icon" />
    <SvgIcon icon="grid" className="drag-handle" />
  </FlexEnd>
);

export default styled(React.forwardRef(CombinedBlockHandle))`
  & ${SvgIconContainer} {
    transition: transform 0.2s ease;

    &:last-of-type {
      position: absolute;
      opacity: 0;
      transition: opacity 0.2s ease;

      &:hover {
        cursor: grab;
      }
    }
  }

  .avatar {
    margin-right: ${units(1.5)}px;

    transition: transform 0.2s ease;
  }
`;
