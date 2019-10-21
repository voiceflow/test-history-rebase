import React from 'react';

import SvgIcon, { SvgIconContainer } from '@/components/SvgIcon';
import Flex from '@/componentsV2/Flex';
import { styled } from '@/hocs';

const CombinedBlockHandle = ({ icon, color, className }, ref) => (
  <Flex className={className} ref={ref}>
    <SvgIcon icon={icon} color={color} className="drag-handle__icon" />
    <SvgIcon icon="grid" className="drag-handle" />
  </Flex>
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
`;
