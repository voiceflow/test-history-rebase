import { styled } from '@/hocs';

export const ClickableLayer = styled.section`
  content: '';
  position: absolute;
  min-width: 60px;
  height: 100%;
  width: 100%;
  z-index: 30;
  top: 0;
`;
