import IconButton from '@/components/IconButton';
import { css, styled } from '@/hocs';

const activeStyle = css`
  color: #132144 !important;
  box-shadow: none !important;
  background-color: #eef4f6;
  background: #eef4f6;
  border-color: #eef4f6;
`;

const ShapesWrapper = styled(IconButton as any)`
  height: 32px;
  width: 32px;
  padding: 8px;
  border-radius: 5px;
  box-shadow: none;
  margin-bottom: 4px;
  background-color: #f9f9f9;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    color: #132144;
    box-shadow: none;
    background-color: #eef4f6;
  }

  &:active {
    ${activeStyle}
  }

  ${({ active }) => active && activeStyle}
`;

export default ShapesWrapper;
