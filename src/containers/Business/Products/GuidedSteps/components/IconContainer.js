import { css, styled } from '@/hocs';

const IconContainer = styled.div`
  flex: 1;
  padding: 20px 32px 20px 0;
  border-right: 1px solid #eaeff4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: -24px;

  ${({ noBorder }) =>
    noBorder &&
    css`
      border: none;
      padding: 20px 0 20px 32px;
    `}
`;

export default IconContainer;
