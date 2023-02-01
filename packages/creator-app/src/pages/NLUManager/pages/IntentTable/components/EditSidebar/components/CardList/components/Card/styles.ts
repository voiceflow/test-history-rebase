import { css, styled } from '@/hocs/styled';

export const Container = styled.div`
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04);
  background: rgb(238 244 246);
`;

export const TitleContainer = styled.div<{ color: string }>`
  padding: 11px 24px;
  background: #bd425f;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${({ color }) => css`
    background-color: ${color};
  `}
`;

export const BodyContainer = styled.div`
  padding: 16px 24px;
  background: rgb(238 244 246);
  color: #132144;
`;
