import { PrimaryButton } from '@/components/Button';
import Preview from '@/components/Preview';
import { css, styled, transition } from '@/styles';
import { fadeInDownDelayedStyle } from '@/styles/animations';

export const TableNavbarContainer = styled.div<{ width: number; isOpen: boolean; bottom?: number }>`
  position: sticky;
  width: ${({ width }) => `${width}px`};
  height: 54px;
  background-color: #33373a;
  border-radius: 12px;
  bottom: ${({ bottom }) => bottom || 24}px;
  left: calc(50% - 200px);
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  display: none;
  ${fadeInDownDelayedStyle};
  box-shadow:
    0px -1px 0px 0px rgb(0 0 0 / 50%) inset,
    0px 1px 3px 0px rgb(0 0 0 / 16%);

  ${({ isOpen }) =>
    isOpen &&
    css`
      display: flex;
    `};
`;

export const ToolbarPrimaryButton = styled(PrimaryButton)`
  padding: 11px 20px;
  height: 42px;

  span {
    padding: 0;
  }
`;

export const MinusButtonIcon = styled.div`
  width: 8px;
  height: 2px;
  background-color: #ffffff;
  border-radius: 5px;
`;

export const MinusButton = styled.div`
  ${transition('background')};
  width: 16px;
  height: 16px;
  background-color: #4b5052;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  margin-right: 12px;

  &:hover {
    background-color: #5d6264;
  }
`;

export const RightActions = styled.div`
  height: 100%;
  padding: 6px;
  display: flex;
  gap: 6px;
`;

export const IconFooterButton = styled(Preview.ButtonIcon)`
  width: 56px;
  height: 42px;
  border-radius: 10px;
`;

export const SecondaryFooterButton = styled(Preview.Button)`
  ${transition('background-color', 'color')};
  padding: 11px 20px;
  width: max-content;
  height: 42px;
  background-color: #4b5052;
  color: #f2f7f7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  cursor: pointer;
  border-radius: 10px;
  font-size: 15px;

  &:hover {
    background-color: #5d6264;
  }
`;
