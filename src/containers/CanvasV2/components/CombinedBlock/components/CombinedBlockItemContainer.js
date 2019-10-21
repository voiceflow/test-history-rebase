import { SvgIconContainer } from '@/components/SvgIcon';
import NestedBlock from '@/containers/CanvasV2/components/NestedBlock';
import { css, styled, transition } from '@/hocs';

export const combinedBlockItemContainerStyles = css`
  ${SvgIconContainer}.drag-handle__icon {
    ${transition('transform')}
  }

  &:hover ${SvgIconContainer} {
    &.drag-handle__icon {
      transform: translateX(calc(-100% - ${({ theme }) => theme.unit}px));
    }

    &.drag-handle {
      opacity: 1;
    }
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
