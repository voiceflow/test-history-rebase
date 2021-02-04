import { styled, units } from '@/hocs';

const Title = styled.div`
  position: absolute;
  left: 0;
  bottom: calc(100% + ${units()}px);
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.secondary};
  transition: transform 0.1s ease;
  transform-origin: top left;

  > span {
    margin-left: ${units()}px;
    color: ${({ theme }) => theme.colors.tertiary};
  }
`;

export default Title;
