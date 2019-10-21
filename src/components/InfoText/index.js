import { css, styled } from '@/hocs';

export const TEXT_COLOR = '#5d9df5';

const InfoText = styled.p`
  border-radius: ${({ theme }) => theme.unit / 2}px;
  border: 1px solid rgba(93, 157, 245, 0.25);
  padding: ${({ theme }) => `${theme.unit}px ${theme.unit * 2}px`};
  color: ${TEXT_COLOR};
  background-color: rgba(93, 157, 245, 0.08);

  ${({ variant }) =>
    variant === 'warn' &&
    css`
      background: #fff3cd;
      color: #856404;
      border-color: #ffeeba;
    `}
`;

export default InfoText;
