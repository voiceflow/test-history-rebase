import styled, { css } from 'styled-components';

export const cardStyles = css`
  border: 1px solid #eaeff4;
  border-radius: 8px;
  padding: 12px 22px;
`;

const Card = styled.div`
  ${cardStyles}
`;

export default Card;
