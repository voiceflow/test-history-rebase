import { styled } from '@/hocs/styled';

export const Container = styled.div`
  top: 0;
  position: absolute;
  left: ${({ theme }) => theme.components.navSidebar.width}px;
  overflow: hidden;
  width: calc(100vw - ${({ theme }) => theme.components.navSidebar.width}px);
  height: 100%;
  display: flex;
  justify-content: center;
  z-index: 1000;
`;

export const SvgShadow = styled.div`
  background-color: #e3f0ff;
  border-radius: 50%;
  height: 104px;
  width: 104px;
  padding: 12px;
  margin-bottom: 16px;
`;

export const UpgradeBox = styled.div`
  background-color: white;
  padding: 24px;
  border: 1px solid rgba(17, 49, 96, 0.1);
  border-radius: 10px;
  margin-top: 230px;
  height: 357px;

  width: 350px;
  box-shadow: 0 1px 3px 0 rgba(19, 33, 68, 0.04);
`;

export const BackgroundContainer = styled.div`
  backdrop-filter: blur(32px);
  height: 100vh;
  inset: 0;
  position: absolute;
  z-index: 9999;
  display: block;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;
