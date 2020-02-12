import { FlexEnd } from '@/components/Flex';
import * as SvgIcon from '@/components/SvgIcon';
import { MemberIcon } from '@/components/User';
import { styled, units } from '@/hocs';

const CombinedBlockHandleContainer = styled(FlexEnd)`
  & ${SvgIcon.Container} {
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

  ${MemberIcon} {
    margin-right: ${units(1.5)}px;

    transition: transform 0.2s ease;
  }
`;

export default CombinedBlockHandleContainer;
