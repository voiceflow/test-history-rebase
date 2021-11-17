import { css, styled } from '@ui/styles';

export const cardStyles = css`
  border-radius: 8px;
`;

const Card = styled.div`
  ${cardStyles}
`;

export default Card;

interface FloatingCardProps {
  isSelected?: boolean;
}

export const floatingCardStyles = css<FloatingCardProps>`
  ${cardStyles}
  box-shadow: ${({ isSelected }) => (isSelected ? '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)' : '0 0 0 1px #d4d9e2')};
`;

export const FloatingCard = styled.div<FloatingCardProps>`
  ${floatingCardStyles}
`;
