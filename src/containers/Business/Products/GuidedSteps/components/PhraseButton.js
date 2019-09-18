import { css, styled } from '@/hocs';

const PhraseButton = styled.div`
  padding-left: 10px;
  align-items: center;
  display: flex;
  cursor: pointer;
  color: #6e849a;

  ${({ disable }) =>
    disable &&
    css`
      cursor: auto;
      color: #bac4cf;
      pointer-events: none;
    `}

  ${({ addPadding }) =>
    addPadding &&
    css`
      padding-right: 24px;
    `}
`;

export default PhraseButton;
