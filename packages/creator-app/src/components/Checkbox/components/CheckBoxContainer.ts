import { css, styled } from '@/hocs';

interface CheckBoxContainerProps {
  isFlat?: boolean;
  disabled?: boolean;
}

const CheckBoxContainer = styled.label<CheckBoxContainerProps>`
  position: relative;
  display: flex;
  align-items: center;
  min-width: 0;
  margin-bottom: 0;
  text-align: left;
  user-select: none;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};

  ${({ isFlat }) =>
    isFlat &&
    css`
      color: #132144 !important;
      font-weight: normal !important;
    `}
`;

export default CheckBoxContainer;
