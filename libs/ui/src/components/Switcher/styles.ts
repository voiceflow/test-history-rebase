import { LoadCircle, LoadContainer } from '@/components/Loader';
import { css, styled } from '@/styles';

export const SwitcherContainer = styled.div`
  background: #f2f4f5;
  width: 101px;
  height: 36px;
  padding: 2px;
  display: flex;
  border-radius: 8px;
  gap: 1px;
  position: relative;
`;

export const SwitcherButton = styled.div<{ isActive: boolean }>`
  background: transparent;
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 1;

  ${LoadContainer} {
    margin: 0;
  }

  ${LoadCircle} {
    display: none;
    background-size: auto;
    background-color: transparent;
  }

  ${({ isActive }) =>
    isActive &&
    css`
      ${LoadCircle} {
        display: flex;
      }
    `}
`;

export const Slider = styled.div<{ isActive: boolean }>`
  position: absolute;
  background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(253, 253, 253, 1) 100%);
  box-shadow:
    0 1px 3px 1px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(0, 0, 0, 0.02983);
  width: 48px;
  height: 32px;
  left: 2px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition-property: left;
  transition-duration: 0.3s;

  ${({ isActive }) =>
    !isActive &&
    css`
      left: 50%;
    `}
`;
