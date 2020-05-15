import { styled } from '@/hocs';

type CheckBoxContainerProps = {
  disabled?: boolean;
};

const CheckBoxContainer = styled.label<CheckBoxContainerProps>`
  position: relative;
  display: flex;
  align-items: center;
  min-width: 0;
  margin-bottom: 0;
  text-align: left;
  user-select: none;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
`;

export default CheckBoxContainer;
