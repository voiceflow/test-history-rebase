import * as SvgIcon from '@/components/SvgIcon';
import { MemberIcon } from '@/components/User';
import { css, styled, transition } from '@/hocs';
import NestedBlock from '@/pages/Canvas/components/NestedBlock';

export const combinedBlockItemContainerStyles = css`
  ${SvgIcon.Container}.drag-handle__icon,
  ${MemberIcon} {
    ${transition('transform')}
  }

  &:hover ${SvgIcon.Container} {
    &.drag-handle__icon {
      transform: translateX(calc(-100% - ${({ theme }) => theme.unit}px));
    }

    &.drag-handle {
      opacity: 1;
    }
  }

  &:hover ${MemberIcon} {
    transform: translateX(calc(-100% + ${({ theme }) => theme.unit}px));
  }

  .nestedBlockItem {
    flex: 0.5;
  }

  ${({ isEnabled }) =>
    !isEnabled &&
    css`
      opacity: 0.5;
    `};
`;

const CombinedBlockItemContainer = styled(NestedBlock)`
  ${combinedBlockItemContainerStyles}
`;

export default CombinedBlockItemContainer;
