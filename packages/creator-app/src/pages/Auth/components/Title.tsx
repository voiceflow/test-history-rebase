import { styled } from '@/hocs';

const Title = styled.h1`
  font-size: 22px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 24px;
`;

export default Title;
