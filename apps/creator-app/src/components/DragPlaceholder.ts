import { itemDragPlaceholder } from '@/assets';
import { css, styled } from '@/hocs/styled';

export const dragPlaceholderStyles = css`
  background-image: url(${itemDragPlaceholder});
  background-repeat: no-repeat;
  background-size: cover;
`;

const DragPlaceholder = styled.div`
  ${dragPlaceholderStyles}
`;

export default DragPlaceholder;
