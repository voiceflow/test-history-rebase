import { styled } from '@/hocs';

const ButtonContainer = styled.div`
  padding: 24px 40px;
  margin-bottom: -8px;
  border-top: 1px solid #eaeff4;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  font-size: 15px;
  line-height: 18px;
  color: ${({ disabled }) => (disabled ? '#8da2b5' : '#5d9df5')};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default ButtonContainer;
