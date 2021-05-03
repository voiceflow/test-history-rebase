import { emptyState } from '@/assets';
import { css, styled } from '@/hocs';

export const dragPlaceholderStyles = css`
  background-image: url(${emptyState});
  background-repeat: no-repeat;
  background-size: cover;
`;

const DragPlaceholder = styled.div`
  ${dragPlaceholderStyles}
`;

export default DragPlaceholder;
