import { styled } from '@/hocs/styled';

const Card = styled.div`
  border-radius: 5px;
  box-shadow: 0 1px 3px 0 rgba(17, 49, 96, 0.08), 0 0 1px 1px rgba(17, 49, 96, 0.08);
  background-color: ${({ theme }) => theme.colors.white};
  max-width: 404px;
  margin-top: 32px;
  padding: 32px;
`;

export default Card;
