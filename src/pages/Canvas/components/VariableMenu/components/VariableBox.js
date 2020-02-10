import styled from 'styled-components';

import { SvgIconContainer } from '@/components/SvgIcon';
import { SlotTag, VariableTag } from '@/componentsV2/VariableTag';
import { units } from '@/hocs';

const VariableBox = styled.div`
  ${SlotTag} {
    margin: 0 ${units(0.5)}px ${units(0.5)}px 0;
    cursor: pointer;
  }
  ${VariableTag} {
    margin: 0 ${units(0.5)}px ${units(0.5)}px 0;

    ${SvgIconContainer} {
      /* provide a bigger hitbox for the close button */
      padding: 7px;
      margin: -7px -3px -7px -7px;
      display: inline-block;
      cursor: pointer;
      color: #8da2b5;

      &:hover {
        color: #6e849a;
      }
    }
  }
`;

export default VariableBox;
