import { css, styled } from '@/hocs/styled';

const Title = styled.div<{ marginBottom?: number; secondary?: boolean; disabled?: boolean }>`
  font-size: 15px;
  font-weight: 600;
  color: #132144;
  opacity: ${({ disabled = false }) => (disabled ? '0.5' : '1')};

  span {
    margin-right: 12px;
    vertical-align: middle;
  }

  ${({ marginBottom }) =>
    marginBottom &&
    css`
      margin-bottom: ${marginBottom}px;
    `}

  ${({ secondary }) =>
    secondary &&
    css`
      color: #62778c;
    `}
`;

export default Title;
