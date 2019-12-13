import { css, styled } from '@/hocs';

export const TEXT_COLOR = '#5d9df5';

const InfoText = styled.p`
  border-radius: ${({ theme }) => theme.unit / 2}px;
  border: 1px solid rgba(93, 157, 245, 0.15);
  padding: ${({ theme }) => `${theme.unit * 1}px ${theme.unit * 2}px`};
  color: ${TEXT_COLOR};
  background-color: rgba(93, 157, 245, 0.08);

  ${({ variant }) =>
    variant === 'warn' &&
    css`
      background: #fdf3cd;
      color: #c39100;
      border-color: #fbe8b0;
    `}
`;

export default InfoText;
