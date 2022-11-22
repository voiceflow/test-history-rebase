import { Button, Preview, transition } from '@voiceflow/ui';

import { styled } from '@/hocs';

export const TableNavbarContainer = styled.div`
  position: absolute;
  width: 681px;
  height: 54px;
  background-color: #33373a;
  border-radius: 12px;
  bottom: 100px;
  left: calc(50% - 200px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
`;

export const MinusButton = styled.div`
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
  padding-bottom: 3px;

  &:hover {
    background-color: #5d6264;
  }
`;

export const RightActions = styled.div`
  padding-right: 6px;
  display: flex;
  gap: 6px;
`;

export const IconFooterButton = styled(Preview.ButtonIcon)`
  width: 56px;
  height: 42px;
  border-radius: 10px;
`;

export const PrimaryFooterButton = styled(Button)`
  border-radius: 10px;
  width: 157px;
`;

export const SecondaryFooterButton = styled(Preview.Button)`
  ${transition('background-color', 'color')};
  padding: 10px 95px;
  background-color: #4b5052;
  color: #f2f7f7;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  cursor: pointer;
  border-radius: 10px;
  height: 42px;
  font-size: 15px;
  width: 128px;

  &:hover {
    background-color: #5d6264;
  }
`;
