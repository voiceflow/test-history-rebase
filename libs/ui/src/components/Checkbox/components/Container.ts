import { css, styled } from '@/styles';

interface ContainerProps {
  isFlat?: boolean;
  disabled?: boolean;
  activeBar?: boolean;
  isChecked?: boolean;
}

const Container = styled.label<ContainerProps>`
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

  ${({ activeBar, isChecked }) =>
    activeBar &&
    css`
      padding: 8px 16px;
      border: 1px solid transparent;
      width: 100%;
      border-radius: 8px;

      ${isChecked &&
      css`
        background: #eef4f6;
        border: solid 1px #dfe3ed;
      `}
    `}
`;

export default Container;
