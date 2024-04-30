import { colors, styled, ThemeColor } from '@/styles';

export interface ButtonContainerProps {
  disabled?: boolean;
}

const ButtonContainer = styled.div<ButtonContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: -8px;
  padding: 24px 40px;
  color: ${({ disabled }) => (disabled ? colors(ThemeColor.TERTIARY) : colors(ThemeColor.BLUE))};
  font-size: 15px;
  line-height: 18px;
  border-top: 1px solid #eaeff4;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
`;

export default ButtonContainer;
