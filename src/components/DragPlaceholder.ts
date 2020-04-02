import { css, styled } from '@/hocs';

export const dragPlaceholderStyles = css`
  background-image: url('/empty-state.svg');
  background-repeat: no-repeat;
  background-size: cover;
`;

const DragPlaceholder = styled.div`
  ${dragPlaceholderStyles}
`;

export default DragPlaceholder;
